import axios from "axios";
import { type slackNotion } from "../templates";

export const createScenario = async (scenarioTemplates: typeof slackNotion) => {
  const url = `https://eu1.make.com/api/v2/scenarios?confirmed=true`;

  const headers = {
    Authorization: "Token a054991d-830c-4484-9501-0e30cc3b1c6f",
  };

  const { blueprint, scheduling } = scenarioTemplates;
  const schedulingString = JSON.stringify(scheduling);
  const blueprintString = JSON.stringify(blueprint);
  const data = {
    teamId: 334459,
    scheduling: schedulingString,
    blueprint: blueprintString,
  };
  return axios.post(url, data, {
    headers,
  });
};
