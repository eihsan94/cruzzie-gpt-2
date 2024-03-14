import { object, string } from "zod";

export const additionalActionModel = object({
  name: string(),
  type: string(),
  options: string(),
  label: string(),
  placeholder: string(),
  prefetchFnEnum: string(),
  value: string(),
});

export const updateAdditionalActionModel = object({
  id: string(),
  name: string(),
  type: string(),
  options: string(),
  label: string(),
  placeholder: string(),
  prefetchFnEnum: string(),
  value: string(),
});
