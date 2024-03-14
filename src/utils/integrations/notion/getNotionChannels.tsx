import { Image } from "@chakra-ui/react";
import { type ReactNode } from "react";
import { type ChannelData } from "~/types/types";
import { type NotionPage, type NotionCreds } from "./types";

interface GetNotionChannels {
  (creds: string): Promise<ChannelData[]>;
}
interface NotionApiResponse {
  response: NotionPage[];
}

export const getNotionChannels: GetNotionChannels = async (creds) => {
  const { access_token } = JSON.parse(creds) as NotionCreds;

  try {
    const res = (await fetch(
      `/api/v1/integrations/notion/allPages?accessToken=${access_token}`
    ).then((res) => res.json())) as NotionApiResponse;
    const channels = constructChannels(res.response);
    // const channels = res.response.map((c: NotionPage) => ({
    //   id: c.id,
    //   name: c.properties.title
    //     ? (c.properties.title.title[0]?.plain_text as string)
    //     : "Untitled",
    //   icon: c.icon ? c.icon.emoji : "",
    // }));
    return channels;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

const constructChannels = (pages: NotionPage[]): ChannelData[] => {
  const findSubChannels = (parentId: string): ChannelData[] => {
    console.log("findSubChannels", parentId);
    return pages
      .filter(
        (page) =>
          page.parent.type === "page_id" && page.parent.page_id === parentId
      )
      .sort(
        (a, b) =>
          new Date(a.created_time).getTime() -
          new Date(b.created_time).getTime()
      )
      .filter((page) => page.archived === false)
      .map((subPage) => ({
        id: subPage.id,
        name: subPage.properties.title
          ? subPage.properties.title.title[0]?.plain_text || "Untitled"
          : "Untitled",
        channelId: subPage.id,
        subChannels: findSubChannels(subPage.id),
        icon: GenerateIcon(subPage),
      }));
  };

  const topLevelPages = pages
    .filter((page) => page.parent.type !== "page_id")
    .sort(
      (a, b) =>
        new Date(a.created_time).getTime() - new Date(b.created_time).getTime()
    );
  const channels: ChannelData[] = topLevelPages.map((page) => ({
    id: page.id,
    name: page.properties.title
      ? page.properties.title.title[0]?.plain_text || "Untitled"
      : "Untitled",
    channelId: page.id,
    subChannels: findSubChannels(page.id),
    icon: GenerateIcon(page),
  }));

  return channels;
};

const GenerateIcon = (page: NotionPage): ReactNode => {
  if (page.icon) {
    if (page.icon.type === "emoji") {
      return page.icon.emoji;
    } else if (page.icon.type === "external") {
      return <Image w="1em" src={page.icon.external?.url || ""} alt="icon" />;
    } else if (page.icon.type === "file") {
      return (
        <Image
          mt="5px"
          h="1.5em"
          rounded={"3px"}
          src={page.icon.file?.url || ""}
          alt="icon"
        />
      );
    }
  }
  return (
    <Image
      mt="5px"
      h="1.5em"
      rounded={"3px"}
      src={"https://www.notion.so/icons/document_gray.svg"}
      alt="icon"
    />
  );
};
