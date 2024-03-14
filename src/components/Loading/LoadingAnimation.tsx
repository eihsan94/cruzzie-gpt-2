import Rive from "@rive-app/react-canvas";
import withAnimateOnLoad from "~/hoc/withAnimateOnLoad";
import { Box, Flex, Text } from "@chakra-ui/react";

interface LoadingAnimationProps {
  loadingText?: string;
}

const LoadingAnimation = ({ loadingText }: LoadingAnimationProps) => {
  return (
    <Flex
      h="100vh"
      w="100vw"
      pt="32"
      justifyContent="center"
      alignItems="center">
      <Box position="relative" h="64" w="64">
        <Text
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          fontSize="xl"
          fontWeight="bold">
          {loadingText || "Loading...."}
        </Text>
        <Rive src="/animations/loading.riv" />
      </Box>
    </Flex>
  );
};

export default withAnimateOnLoad({
  WrappedComponent: LoadingAnimation,
  duration: 100,
});
