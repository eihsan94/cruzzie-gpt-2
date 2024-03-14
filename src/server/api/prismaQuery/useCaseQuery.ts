export const useCasesFromAppsQuery = (appsLowerCase: string[]) => ({
  where: {
    apps: {
      every: {
        name: { in: appsLowerCase },
      },
    },
  },
  include: {
    apps: true,
    trigger: {
      include: {
        additionalActions: true,
      },
    },
    actions: {
      include: {
        additionalActions: true,
      },
    },
  },
});
