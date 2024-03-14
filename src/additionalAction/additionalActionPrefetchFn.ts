/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import axios from "axios";

import {
  AdditionalDataFormat,
  ColumnInputType,
  type ColumnDefinition,
} from "~/types/types";
import { AdditionalActionPrefetchEnum } from "./additionalActionEnum";
export type OtherData = { id: string; columns: ColumnDefinition[] }[];
type ReturnData = {
  selections: { value: any; label: string }[];
  inputDataFormatType: AdditionalDataFormat;
  otherData?: OtherData;
};

type additionalDataPrefetchFnType = ({
  prefetchFnEnum,
  creds,
}: {
  prefetchFnEnum: AdditionalActionPrefetchEnum;
  creds: any;
}) => Promise<ReturnData>;

// additional action Prefetch function utils
export const additionalActionPrefetchFn: additionalDataPrefetchFnType = async ({
  prefetchFnEnum,
  creds,
}) => {
  const prefetchData = await prefetchFnLists[prefetchFnEnum](creds);

  return prefetchData;
};

type PrefetchFnLists = {
  [key in AdditionalActionPrefetchEnum]: (creds: any) => Promise<ReturnData>;
};
const prefetchFnLists: PrefetchFnLists = {
  [AdditionalActionPrefetchEnum.SLACK_FETCH_CHANNELS]: async (creds: any) => {
    try {
      const res = await fetch(
        `/api/v1/actions/slack/conversationLists?accessToken=${creds.authed_user.access_token}`
      ).then((res) => res.json());
      const channels = res.response.map((c: any) => ({
        value: c.id,
        label: c.name,
      }));
      return {
        selections: channels,
        inputDataFormatType: AdditionalDataFormat.NONE,
      };
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  },
  [AdditionalActionPrefetchEnum.NOTION_FETCH_DB]: async (creds: any) => {
    try {
      const res = await fetch(
        `/api/v1/integrations/notion/databasesList?accessToken=${creds.access_token}`
      ).then((res) => res.json());

      const dbs = res.response.map((d: any) => ({
        value: d.id,
        label:
          d.title.length > 0
            ? d.title[d.title.length - 1].plain_text
            : "Untitled",
      }));
      const dbProperties: OtherData = res.response.map((d: any) => ({
        id: d.id,
        columns: genColumnsDefinition(d.properties, "notion"),
      }));

      return {
        selections: dbs,
        inputDataFormatType: AdditionalDataFormat.TABLE,
        otherData: dbProperties,
      };
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  },
};

const genColumnsDefinition: (
  fields: any,
  appType: "notion"
) => ColumnDefinition[] = (fields, appType) => {
  if (appType === "notion") {
    const columnDefinitions: ColumnDefinition[] = [];
    for (const fieldName of Object.keys(fields)) {
      const field = fields[fieldName];
      switch (field.type) {
        case "multi_select":
          columnDefinitions.push({
            th: field.name,
            td: field.name,
            type: ColumnInputType.MULTI_SELECT,
            options: field.multi_select.options.map((option: any) => ({
              value: option.id,
              label: option.name,
            })),
          });
          break;

        case "title":
          columnDefinitions.push({
            th: field.name,
            td: field.name,
            type: ColumnInputType.TEXT,
          });
          break;

        default:
          columnDefinitions.push({
            th: field.name,
            td: field.name,
            type: ColumnInputType.TEXT,
          });
      }
    }

    return columnDefinitions;
  }
  return [];
};
