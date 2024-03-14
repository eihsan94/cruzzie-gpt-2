/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
// Path: /api/v1/actions/slack/conversationLists
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import axios from "axios";
import { WebClient } from "@slack/web-api";
import { type NextApiRequest, type NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { accessToken, channelId } = req.query;
  try {
    const client = new WebClient(accessToken as string, {
      // logLevel: LogLevel.DEBUG,
    });
    const result = await client.conversations.info({
      channel: channelId as string,
    });
    const { channel } = result;
    return res.status(200).json({ response: channel, error: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: null, error });
  }
};

export default handler;
