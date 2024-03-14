import { object, string, array } from "zod";
import {
  automationActionModel,
  updateAutomationActionModel,
} from "./automationAction.model";
import {
  automationTriggerModel,
  updateAutomationTriggerModel,
} from "./automationTrigger.model";

export const automationUsecaseModel = object({
  name: string(),
  logicEndpoint: string(),
  automationTrigger: automationTriggerModel,
  automationActions: array(automationActionModel),
});
export const updateAutomationUsecaseModel = object({
  id: string(),
  name: string(),
  logicEndpoint: string(),
  automationTrigger: updateAutomationTriggerModel,
  automationActions: array(updateAutomationActionModel),
});
