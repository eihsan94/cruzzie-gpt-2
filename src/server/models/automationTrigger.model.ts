import { array } from "zod";

import { object, string } from "zod";
import {
  additionalActionModel,
  updateAdditionalActionModel,
} from "./additionalAction.model";
import { appChannelModel, updateAppChannelModel } from "./appChannel.model";

export const automationTriggerModel = object({
  appName: string(),
  event: string(),
  eventDescription: string(),
  oAuth2: string(),
  imageUrl: string(),
  logicEndpoint: string(),
  additionalData: string().nullable(),
  dataOutputs: string().nullable(),
  creds: string().optional(),
  appChannels: array(appChannelModel).optional(),
  additionalActions: array(additionalActionModel).optional(),
});
export const updateAutomationTriggerModel = object({
  id: string(),
  appName: string().optional(),
  event: string().optional(),
  eventDescription: string().optional(),
  oAuth2: string().optional(),
  imageUrl: string().optional(),
  logicEndpoint: string().optional(),
  additionalData: string().nullable(),
  dataOutputs: string().nullable(),
  creds: string().optional().nullable(),
  appChannels: array(updateAppChannelModel).optional(),
  additionalActions: array(updateAdditionalActionModel).optional(),
});

export const params = object({
  id: string(),
});

export const automationTriggerUpdateModel = object({
  params,
  body: updateAutomationTriggerModel,
});
