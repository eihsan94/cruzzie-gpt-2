export const containsValidApps = (apps: string[]): boolean => {
  const validApps = new Set(["notion", "slack"]);
  return (
    apps.length === validApps.size && apps.every((app) => validApps.has(app))
  );
};
