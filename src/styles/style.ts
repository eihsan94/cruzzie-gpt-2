import { type AppColorScheme } from "~/types/types";

export const primaryColor = "#4F68D6";
export const primaryButtonColor = {
  bg: primaryColor,
  color: "#FFFFFF",
  _hover: {
    bg: "#3B4FA5",
  },
};

export const appColorScheme: AppColorScheme = {
  slack: {
    bg: "#3F0E40",
    color: "#FFFFFF",
    focus: { bg: "#7C4DFF", color: "#FFFFFF", border: "1px solid #9D174D" },
  },
  notion: {
    bg: "#FCF1E1",
    color: "#3F3F3F",
    focus: { bg: "#EDEDED", color: "#111111", border: "1px solid #C4C4C4" },
  },
};
