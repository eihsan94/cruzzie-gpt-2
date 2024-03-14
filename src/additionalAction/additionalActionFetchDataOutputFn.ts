/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { type DataOutput } from "~/types/types";
import { DataOutputsFetchEnumFn } from "./additionalActionEnum";

export const genDataOutput = async (
  { fetchEnumFn }: DataOutput,
  args: any,
  creds: any
): Promise<DataOutput> => {
  const dataOutput: DataOutput = {
    fetchEnumFn,
    data: await genDataOutputMap[fetchEnumFn](args, creds),
  };
  return dataOutput;
};

const slackFetchChannelDetails = async (
  channelId: string,
  creds?: any
): Promise<DataOutput["data"]> => {
  const res = await fetch(
    `/api/v1/actions/slack/conversationInfo?accessToken=${creds.authed_user.access_token}&channelId=${channelId}`
  ).then((res) => res.json());
  return res.response;
};

const genDataOutputMap = {
  [DataOutputsFetchEnumFn.SLACK_FETCH_CHANNEL_DETAILS]: (
    channelIds: string[],
    creds?: string
  ) => slackFetchChannelDetails(channelIds[0] as string, creds),
};
