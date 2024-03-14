import { object, string } from "zod";
import {
  automationUsecaseModel,
  updateAutomationUsecaseModel,
} from "./automationUseCase.model";

export const automationModel = object({
  name: string(),
  automationUseCase: automationUsecaseModel,
});

export const updateAutomationModel = object({
  id: string(),
  name: string(),
  automationUseCase: updateAutomationUsecaseModel,
});

export const params = object({
  id: string(),
});

export const automationUpdateModel = object({
  params,
  body: updateAutomationModel,
});
