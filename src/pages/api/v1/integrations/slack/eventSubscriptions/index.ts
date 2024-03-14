/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// import axios from "axios";
import { type Automation } from "@prisma/client";
import { type NextApiRequest, type NextApiResponse } from "next";
import { prisma } from "~/server/db";
// import { prisma } from "~/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const payload = req.body;
    const messageType = payload.type;

    if (messageType === "url_verification") {
      // Slack URL verification
      return res.status(200).json({ challenge: payload.challenge });
    } else if (messageType === "event_callback") {
      // Handle Slack event
      const event = payload.event;
      if (event.type === "message" && !event.subtype) {
        // Process new Slack message
        // const messageContent = event.text;
        // const channelId = event.channel;
        const automation = (await prisma.automation.findFirst({
          select: {
            id: true,
          },
        })) as Automation;
        await prisma.automationHistory.create({
          data: {
            data: JSON.stringify(payload),
            automationId: automation.id,
          },
        });
        // save the messageContent in the database
        // Find the automation, trigger, and action for the Slack message
        // const automation = await prisma.automation.findFirst({
        //   where: {
        //     userId,
        //     trigger: {
        //       channelId,
        //     },
        //   },
        //   include: {
        //     trigger: true,
        //     action: true,
        //   },
        // });
        // Call the Notion webhook listener to save the message to the Notion database
        // if (automation) {
        //   const { action } = automation;
        //   await axios.post("/api/webhooks/notion", {
        //     messageContent,
        //     databaseId: action.databaseId,
        //     userId,
        //   });
        // }
      }
    }
  }

  res.status(200).end();
};

export default handler;
