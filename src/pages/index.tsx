/* eslint-disable @typescript-eslint/no-unused-vars */
import { withAuth } from "next-auth/middleware";

import { type GetServerSidePropsContext, type NextPage } from "next";
import { Layout } from "~/components/Layout";
import { ChatFeatures } from "~/features/ChatFeatures";
import { getServerAuthSession } from "~/server/auth";

const Home: NextPage = () => {
  return (
    <>
      <Layout>
        <ChatFeatures />
      </Layout>
    </>
  );
};

export default Home;

export const getServerSideProps = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  const session = await getServerAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};
