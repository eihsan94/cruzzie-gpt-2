/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "~/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const clientId = process.env.NEXT_PUBLIC_NOTION_CLIENT_ID as string;
    const clientSecret = process.env.NEXT_PUBLIC_NOTION_CLIENT_SECRET as string;
    const redirectUri = process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL;

    const { code, state } = req.query;

    if (!code || Array.isArray(code)) {
      return res
        .status(400)
        .json({ error: "Code parameter is missing or invalid" });
    }

    const url = "https://api.notion.com/v1/oauth/token";

    const requestBody = {
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    };

    const requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    };
    try {
      const response = await axios.post(url, requestBody, {
        headers: requestHeaders,
      });

      const { data } = response;

      const { automationId, automationName, triggerId, actionId, redirectUrl } =
        JSON.parse(state as string);
      const creds = JSON.stringify(data);
      // Save the access token in your application (e.g., database or session)
      if (actionId) {
        await prisma.automation.update({
          where: { id: automationId },
          data: {
            name: automationName,
            automationUseCase: {
              update: {
                automationActions: {
                  update: {
                    where: { id: actionId },
                    data: {
                      creds,
                    },
                  },
                },
              },
            },
          },
        });
      } else if (triggerId) {
        await prisma.automation.update({
          where: { id: automationId },
          data: {
            name: automationName,
            automationUseCase: {
              update: {
                automationTrigger: {
                  update: {
                    creds,
                  },
                },
              },
            },
          },
        });
      }
      res.redirect(redirectUrl as string);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  }

  res.status(200).end();
};

export default handler;
