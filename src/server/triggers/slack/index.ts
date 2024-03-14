/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// slackUtil.ts
import { WebClient } from "@slack/web-api";

interface SlackData {
  id: number;
  appName: string;
  event: string;
  eventDescription: string;
  oAuth2: string;
  imageUrl: string;
  logicEndpoint: string;
  additionalData: string;
  creds: string;
  automationUseCaseId: string;
}

async function subscribeToSlackChannel(
  channelId: string,
  creds: SlackData["creds"]
): Promise<{ response: unknown; error: unknown }> {
  // Parse the creds from the data object
  const credsJson = JSON.parse(creds);

  // Extract the access token
  const accessToken = credsJson.authed_user.access_token;

  // Initialize the Slack WebClient with the access token
  const slackClient = new WebClient(accessToken);

  // Subscribe to the specified channel
  try {
    const response = await slackClient.conversations.join({
      channel: channelId,
    });
    return { response, error: null };
  } catch (error) {
    return { response: null, error };
  }
}

export { subscribeToSlackChannel };
