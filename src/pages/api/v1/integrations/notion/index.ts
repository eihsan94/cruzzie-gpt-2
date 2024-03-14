import { Client } from "@notionhq/client";
import { type CreatePageBodyParameters } from "./types";

async function saveItemInNotionDatabase(
  pageProperties: CreatePageBodyParameters["properties"],
  notionDatabaseId: string,
  pageId: string,
  accessToken: string,
  nextFn?: (args: unknown) => void
) {
  // Initialize the Notion client
  const notion = new Client({ auth: accessToken });

  const res = await notion.pages.create({
    parent: { database_id: notionDatabaseId, page_id: pageId },
    properties: pageProperties,
  });
  if (nextFn) {
    nextFn?.(res);
  }
}

export { saveItemInNotionDatabase };
