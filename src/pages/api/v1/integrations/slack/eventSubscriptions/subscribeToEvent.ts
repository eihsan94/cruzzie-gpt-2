/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import axios from "axios";
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";
import { subscribeToSlackChannel } from "~/server/triggers/slack";
// import { prisma } from "~/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const automationTriggerId = req.query.automationTriggerId as string;
  const channelId = "C04V9FM8ZL5";
  // find the automation trigger
  const automationTrigger = await prisma.automationTrigger.findFirst({
    where: {
      id: automationTriggerId,
    },
  });
  try {
    const response = await subscribeToSlackChannel(
      channelId,
      automationTrigger?.creds as string
    );
    return res.status(200).json({ response, error: null });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: null, error });
  }
};

export default handler;
