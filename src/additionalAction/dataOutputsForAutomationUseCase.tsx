import { type ReactNode } from "react";

export interface SupportedDataOutputColumns {
  label: ReactNode;
  historyKey: string;
}

export interface TDataOutputColumns {
  [key: string]: {
    columns: SupportedDataOutputColumns[];
  };
}

export const DataOutputsColumn: TDataOutputColumns = {
  slack: {
    columns: [
      {
        label: "User Name",
        historyKey: "slackUserName", // get this from automation history
      },
      {
        label: "Message Send In Channel",
        historyKey: "slackText", // get this from automation history
      },
    ],
  },
};
