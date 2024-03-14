/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  Fade,
  HStack,
  Text,
} from "@chakra-ui/react";
import { LockClosedIcon } from "@heroicons/react/24/outline";
import { Loading } from "@nextui-org/react";
import { useState, type ReactNode } from "react";
import { useChannels } from "~/hooks/useChannels";
import { appColorScheme } from "~/styles/style";
import { type ChannelData, type FocusAppColorScheme } from "~/types/types";

interface ChooseChannelsProps {
  creds: string;
  appName: string;
  defaultSelectedChannels: ChannelData[];
  multiple?: boolean;
  onSelect: (channels: ChannelData[]) => void;
}

interface AccordionChannelWithSelectProps {
  channel: ChannelData;
  showId: string;
  appName: string;
  setShowId: (id: string) => void;
  level?: number;
  onSelect: (channel: ChannelData) => void;
  selectedChannels: ChannelData[];
  multiple?: boolean;
  selectedColor: FocusAppColorScheme;
}

const accordionProps = {
  allowMultiple: true,
  w: "full",
  border: "none",
};

const AccordionChannelWithSelect: React.FC<AccordionChannelWithSelectProps> = ({
  channel,
  showId,
  setShowId,
  level = 0,
  onSelect,
  selectedChannels,
  selectedColor,
  multiple,
  appName,
}) => {
  const isShown = showId === channel.id;
  const hasSubChannels = channel.subChannels && channel.subChannels.length > 0;
  const isSelected = selectedChannels.some(
    (selectedChannel) => selectedChannel.channelId === channel.id
  );

  const handleMouseEnter = () => {
    setShowId(channel.id);
  };

  const handleMouseLeave = () => {
    setShowId("");
  };

  const handleClick = () => {
    onSelect(channel);
  };

  return (
    <AccordionItem key={channel.id} border="none">
      <HStack onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <AccordionButton
          bg={isSelected ? selectedColor.bg : undefined}
          border={isSelected ? selectedColor.border : undefined}
          color={isSelected ? selectedColor.color : undefined}>
          {hasSubChannels && <AccordionIcon />}
          <Box as="span" flex="1" textAlign="left" ml={`${level * 0.5}em`}>
            {showChannelName({
              appName,
              icon: channel.icon,
              ...channel,
            })}
          </Box>
        </AccordionButton>
        <Box pos={"absolute"} right="5px">
          <Fade in={isShown}>
            <Button size="sm" colorScheme={"blue"} onClick={handleClick}>
              Select
            </Button>
          </Fade>
        </Box>
      </HStack>
      {channel.subChannels && (
        <AccordionPanel pb={4}>
          <Accordion {...accordionProps}>
            {channel.subChannels.map((subChannel) => (
              <AccordionChannelWithSelect
                appName={appName}
                selectedColor={selectedColor}
                key={subChannel.id}
                channel={subChannel}
                showId={showId}
                setShowId={setShowId}
                level={level + 1}
                onSelect={onSelect}
                selectedChannels={selectedChannels}
                multiple={multiple}
              />
            ))}
          </Accordion>
        </AccordionPanel>
      )}
    </AccordionItem>
  );
};

const ChooseChannels: React.FC<ChooseChannelsProps> = ({
  creds,
  appName,
  multiple = false,
  defaultSelectedChannels = [],
  onSelect,
}) => {
  const [selectedChannels, setSelectedChannels] = useState<ChannelData[]>(
    defaultSelectedChannels
  );

  const [showId, setShowId] = useState("");
  const { channels, isLoading, error } = useChannels(creds, appName);

  const handleSelect = (channel: ChannelData) => {
    const protoSelectedChannels = [...selectedChannels];
    const newChannelIndex = protoSelectedChannels.findIndex(
      (c) => c.id === channel.id
    );
    if (newChannelIndex !== -1) {
      protoSelectedChannels.splice(newChannelIndex, 1);
    } else {
      if (!multiple) {
        protoSelectedChannels.splice(0, protoSelectedChannels.length);
      }
      protoSelectedChannels.push({
        ...channel,
        channelId: channel.id,
      });
    }
    setSelectedChannels(protoSelectedChannels);
    onSelect(protoSelectedChannels);
  };

  return (
    <>
      <Card
        {...appColorScheme[appName]}
        w={"400px"}
        height="400px"
        display={"flex"}
        overflow={"auto"}>
        {isLoading ? (
          <Loading style={{ marginTop: "5em" }} />
        ) : error ? (
          <Text color={"red"}>Error: {JSON.stringify(error)}</Text>
        ) : (
          <Accordion {...accordionProps}>
            {channels.map((channel, i) => (
              <AccordionChannelWithSelect
                appName={appName}
                key={i}
                channel={channel}
                showId={showId}
                setShowId={setShowId}
                onSelect={handleSelect}
                selectedChannels={selectedChannels}
                multiple={multiple}
                selectedColor={
                  appColorScheme[appName]
                    ?.focus as AccordionChannelWithSelectProps["selectedColor"]
                }
              />
            ))}
          </Accordion>
        )}
      </Card>
    </>
  );
};

export default ChooseChannels;

const showChannelName = ({
  name,
  appName,
  icon,
  is_private,
}: {
  name: string;
  appName: string;
  icon?: ReactNode;
  is_private?: boolean;
}): ReactNode => {
  const channelNameLists: { [key: string]: ReactNode } = {
    slack: (
      <HStack>
        <Text>{is_private ? <LockClosedIcon height="1em" /> : "#"}</Text>
        <Text ml="1px">{name}</Text>
      </HStack>
    ),
    notion: (
      <HStack alignItems={"center"} ml="5px">
        <Text mb="5px">{icon}</Text>
        <Text ml="1px">{name}</Text>
      </HStack>
    ),
  };
  const channelName = channelNameLists[appName];
  return channelName || name;
};

export const channelHeaderName = ({
  appName,
}: {
  appName: string;
}): ReactNode => {
  const channelHeaderLists: { [key: string]: ReactNode } = {
    slack: "Channels",
    notion: "Pages",
  };
  const channelHeader = channelHeaderLists[appName];
  return channelHeader || "Channels";
};
