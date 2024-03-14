/* eslint-disable @typescript-eslint/no-explicit-any */
import { type BoxProps } from "@chakra-ui/react";
import {
  type AutomationTrigger,
  type AppChannel,
  type Action,
  type Trigger,
  type UseCase,
  type AutomationAction,
  type AdditionalAction,
} from "@prisma/client";
import { type ReactNode } from "react";
import {
  type DataOutputsFetchEnumFn,
  type AdditionalActionPrefetchEnum,
} from "~/additionalAction/additionalActionEnum";

export interface App {
  id: number;
  app: string;
  actionType: string;
  imageUrl: string;
  event: string;
  description: string;
}

export type TUseCase = UseCase & {
  trigger: Trigger;
  actions: Action[];
};

export enum AdditionalDataFormat {
  TABLE = "TABLE",
  NONE = "NONE",
}

export enum ColumnInputType {
  TEXT = "TEXT",
  SELECT = "SELECT",
  MULTI_SELECT = "MULTI_SELECT",
}

export type InputOption = { value: any; label: string };
export type ColumnDefinition =
  | {
      th: string;
      td: string;
      type: ColumnInputType.TEXT;
      options?: InputOption[];
    }
  | {
      th: string;
      td: string;
      type: ColumnInputType.MULTI_SELECT | ColumnInputType.SELECT;
      options: { value: any; label: string }[];
    };

// Define a new type that combines AdditionalDataFormat and ColumnDefinition
export type InputDataFormat =
  | {
      type: AdditionalDataFormat.TABLE;
      columns: ColumnDefinition[];
    }
  | {
      type: AdditionalDataFormat.NONE;
    };

export interface AdditionalDataInput
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  options: { value: any; label: string }[];
  prefetchFnEnum?: AdditionalActionPrefetchEnum;
  value: any;
  inputDataFormat?: InputDataFormat;
}

export interface DataOutput {
  fetchEnumFn: DataOutputsFetchEnumFn;
  data: [];
}

export type FocusAppColorScheme = {
  bg: BoxProps["bg"];
  color: BoxProps["color"];
  border: BoxProps["border"];
};

export type AppColorScheme = {
  [appName: string]: {
    bg: BoxProps["bg"];
    color: BoxProps["color"];
    focus: FocusAppColorScheme;
  };
};

export type ChannelData = Omit<
  AppChannel,
  "automationTriggerId" | "automationActionId" | "createdAt" | "updatedAt"
> & {
  subChannels?: ChannelData[];
  icon?: ReactNode;
};

export type TAutomationTrigger = AutomationTrigger & {
  appChannels?: ChannelData[];
  additionalActions?: AdditionalAction[];
};

export type TAutomationAction = AutomationAction & {
  appChannels?: ChannelData[];
  additionalActions?: AdditionalAction[];
};
