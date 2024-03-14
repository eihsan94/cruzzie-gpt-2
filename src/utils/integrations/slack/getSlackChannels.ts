import { type ChannelData } from "~/types/types";
import { type SlackChannel, type SlackCreds } from "./types";

interface GetSlackChannels {
  (creds: string): Promise<ChannelData[]>;
}
interface SlackApiResponse {
  response: {
    id: string;
    name: string;
  }[];
}

export const getSlackChannels: GetSlackChannels = async (creds) => {
  const { authed_user } = JSON.parse(creds) as SlackCreds;

  try {
    const res = (await fetch(
      `/api/v1/integrations/slack/conversationLists?accessToken=${authed_user.access_token}`
    ).then((res) => res.json())) as SlackApiResponse;
    const channels = res.response.map((c: SlackChannel) => ({
      id: c.id,
      name: c.name,
      channelId: c.id,
      is_private: c.is_private,
    }));
    return channels;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
