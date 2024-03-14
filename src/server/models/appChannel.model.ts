import { object, string } from "zod";

export const appChannelModel = object({
  name: string(),
  channelId: string(),
});

export const updateAppChannelModel = object({
  id: string(),
  name: string(),
  channelId: string(),
});
