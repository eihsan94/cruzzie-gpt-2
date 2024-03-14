import { type ChannelData } from "~/types/types";
import { getNotionChannels } from "../notion/getNotionChannels";
import { getSlackChannels } from "../slack/getSlackChannels";

export type GetChannelsFunction = (
  creds: string,
  appName: string
) => Promise<ChannelData[]>;

export const getChannels: GetChannelsFunction = (creds, appName) => {
  const getChannelFunction = getChannelsMap[appName];

  if (getChannelFunction) {
    return getChannelFunction(creds);
  } else {
    throw new Error(`Unknown app name: ${appName}`);
  }
};

export const getChannelsMap: Record<
  string,
  (creds: string) => Promise<ChannelData[]>
> = {
  slack: getSlackChannels,
  notion: getNotionChannels,
  // Add more integrations here
};
