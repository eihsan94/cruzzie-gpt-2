export type GetAutomationByIdQuery = (id: string) => {
  where: {
    id: string;
  };
  include: {
    automationUseCase: {
      include: {
        automationActions: {
          include: {
            additionalActions: boolean;
            appChannels: boolean;
          };
        };
        automationTrigger: {
          include: {
            additionalActions: boolean;
            appChannels: boolean;
          };
        };
      };
    };
  };
};

export type GetAutomationsQuery = {
  include: {
    automationUseCase: {
      include: {
        automationActions: {
          include: {
            additionalActions: boolean;
            appChannels: boolean;
          };
        };
        automationTrigger: {
          include: {
            additionalActions: boolean;
            appChannels: boolean;
          };
        };
      };
    };
  };
};
