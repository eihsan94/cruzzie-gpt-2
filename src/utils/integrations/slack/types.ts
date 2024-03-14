export interface SlackChannel {
  id: string;
  name: string;
  is_private?: boolean;
}

export interface SlackCreds {
  authed_user: {
    access_token: string;
  };
}
