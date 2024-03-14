import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChakraProvider } from "@chakra-ui/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
import Head from "next/head";

const queryClient = new QueryClient();

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ChakraProvider>
        <NextUIProvider>
          <QueryClientProvider client={queryClient}>
            <Head>
              <title>Cruzzie </title>
              <meta name="description" content="Zapier but easier" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
          </QueryClientProvider>
        </NextUIProvider>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
