import { type GetAutomationByIdQuery } from "./type";

const includeAutomationUseCase = {
  include: {
    automationUseCase: {
      include: {
        automationActions: {
          include: {
            additionalActions: true,
            appChannels: true,
          },
        },
        automationTrigger: {
          include: {
            additionalActions: true,
            appChannels: true,
          },
        },
      },
    },
  },
};

export const getAutomationsQuery = () => includeAutomationUseCase;

export const getAutomationByIdQuery: GetAutomationByIdQuery = (id) => ({
  where: { id },
  ...includeAutomationUseCase,
});
