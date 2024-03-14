/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextApiRequest, type NextApiResponse } from "next";
import axios from "axios";
import { prisma } from "~/server/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
    const clientSecret = process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET;
    const redirectUri = process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL;

    const { code, state } = req.query;

    if (!code || Array.isArray(code)) {
      return res
        .status(400)
        .json({ error: "Code parameter is missing or invalid" });
    }
    try {
      const response = await axios.get(
        "https://slack.com/api/oauth.v2.access",
        {
          params: {
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            code,
          },
        }
      );

      const { data } = response;
      if (!data.ok) {
        return res
          .status(500)
          .json({ error: "Error during authentication", details: data.error });
      }
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
      // res.status(200).json({ data, state: JSON.parse(state as string) });
      // res.status(200).json(creds);
      // Redirect to a success page, or display a success message
      res.redirect(redirectUrl as string);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error during authentication" });
    }
  }

  res.status(200).end();
};

export default handler;
