import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button, Page, Text } from "@geist-ui/core";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Page>
        <Text h1>Home Page</Text>
        <AuthShowcase />
      </Page>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div>
      {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      <Button
        onClick={
          sessionData
            ? () => void signOut()
            : () => void signIn("google", { callbackUrl: "/" })
        }>
        {sessionData ? "Sign out" : "Sign in"}
      </Button>
    </div>
  );
};
