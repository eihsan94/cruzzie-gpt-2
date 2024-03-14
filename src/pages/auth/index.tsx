/* eslint-disable @typescript-eslint/no-floating-promises */
import { useAtom } from "jotai";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { RedirectRouteAtom } from "~/components/AuthGuard/AuthGuard";
import { Box, Button, Center, Heading, VStack } from "@chakra-ui/react";
import { Logo } from "~/components/Logo";
import withAnimateOnLoad from "~/hoc/withAnimateOnLoad";

function Index() {
  const [redirectRoute] = useAtom(RedirectRouteAtom);

  return (
    <VStack
      gap={4}
      h="80vh"
      alignItems={"center"}
      direction="column"
      justifyContent="center"
      p={{ base: "8", sm: "6", lg: "8" }}>
      <VStack gap={1}>
        <Center>
          <Logo />
        </Center>
        <Heading
          textAlign="center"
          mt="6"
          fontSize="3xl"
          fontWeight="bold"
          color="gray.900">
          Start using Cruzzie
        </Heading>
      </VStack>
      <Box mt="8">
        <Button
          w="full"
          fontWeight="bold"
          textTransform="uppercase"
          size="md"
          bg="white"
          border="1px solid black"
          shadow="xl"
          onClick={() => {
            signIn("google", { callbackUrl: redirectRoute });
          }}
          rightIcon={<FcGoogle />}>
          Start with Google
        </Button>
      </Box>
    </VStack>
  );
}

export default withAnimateOnLoad({ WrappedComponent: Index, type: "fadeUp" });
