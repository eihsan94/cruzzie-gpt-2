export interface NotionUser {
  object: string;
  id: string;
  name: string;
  avatar_url: string;
  type: string;
  person: {
    email: string;
  };
}

export interface NotionOwner {
  type: string;
  user: NotionUser;
}

export interface NotionCreds {
  access_token: string;
  token_type: string;
  bot_id: string;
  workspace_name: string;
  workspace_icon: null | string;
  workspace_id: string;
  owner: NotionOwner;
  duplicated_template_id: null | string;
}

export type RichTextElement = {
  type: "text";
  text: {
    content: string;
    link: null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: null;
};

export type TitleProperty = {
  id: string;
  type: "title";
  title: RichTextElement[];
};

export type CoverExternal = {
  type: "external";
  external: {
    url: string;
  };
};

export type IconEmoji = {
  type: string;
  emoji?: string;
  external?: {
    url: string;
  };
  file?: {
    url: string;
    expiry_time: string;
  };
};

export type ParentWorkspace = {
  type: "workspace" | "page_id";
  page_id: string;
  workspace: boolean;
};

export interface NotionPage {
  object: "page";
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: {
    object: "user";
    id: string;
  };
  last_edited_by: {
    object: "user";
    id: string;
  };
  cover: CoverExternal;
  icon: IconEmoji;
  parent: ParentWorkspace;
  archived: boolean;
  properties: {
    title: TitleProperty;
  };
  url: string;
}
