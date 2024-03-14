import {
  HStack,
  Heading,
  Image,
  Text,
  Card,
  VStack,
  Tooltip,
} from "@chakra-ui/react";
import { type AutomationTrigger } from "@prisma/client";
import React from "react";
import { FiInfo } from "react-icons/fi";

interface AutomationTriggerItemProps {
  trigger: AutomationTrigger;
}

export default function AutomationTriggerItem({
  trigger,
}: AutomationTriggerItemProps) {
  return (
    <VStack maxW="300px">
      <Card py={"1em"} px={"2em"} borderRadius="full" w="fit-content">
        <HStack>
          <Image w="40px" src={trigger?.imageUrl} alt={trigger?.imageUrl} />
          <Heading>{trigger?.appName}</Heading>
        </HStack>
      </Card>
      <HStack>
        <Text maxW="200px" textAlign={"center"} fontSize={"xs"} noOfLines={1}>
          {trigger?.eventDescription}
        </Text>
        <Tooltip label={trigger?.eventDescription} placement="top">
          <div>
            <FiInfo />
          </div>
        </Tooltip>
      </HStack>
    </VStack>
  );
}
