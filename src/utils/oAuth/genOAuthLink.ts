interface GenOAuthLinkArgs {
  appName: string;
  oAuth2: string;
  state: string;
}
const RedirectUriMap: { [key: string]: string | undefined } = {
  notion: process.env.NEXT_PUBLIC_NOTION_REDIRECT_URL,
  slack: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URL,
};

export const genOAuthLink: (args: GenOAuthLinkArgs) => string = ({
  appName,
  oAuth2,
  state,
}) => {
  if (!RedirectUriMap[appName]) {
    throw new Error("RedirectUriMap[appName] is undefined in genOAuthLink");
  }
  return `${oAuth2}&redirect_uri=${
    RedirectUriMap[appName] as string
  }&state=${state}`;
};
