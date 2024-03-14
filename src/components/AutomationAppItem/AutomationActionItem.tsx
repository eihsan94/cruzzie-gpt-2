import {
  HStack,
  Heading,
  Image,
  Text,
  Card,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { type AutomationAction } from "@prisma/client";
import { FiInfo } from "react-icons/fi";

interface AutomationActionItemProps {
  action?: AutomationAction;
}

export default function AutomationActionItem({
  action,
}: AutomationActionItemProps) {
  return (
    <VStack maxW="300px">
      <Card py={"1em"} px={"2em"} borderRadius="full" w="fit-content">
        <HStack>
          <Image w="40px" src={action?.imageUrl} alt={action?.imageUrl} />
          <Heading>{action?.appName}</Heading>
        </HStack>
      </Card>

      <HStack>
        <Text maxW="200px" textAlign={"center"} fontSize={"xs"} noOfLines={1}>
          {action?.eventDescription}
        </Text>
        <Tooltip label={action?.eventDescription} placement="top">
          <div>
            <FiInfo />
          </div>
        </Tooltip>
      </HStack>
    </VStack>
  );
}
