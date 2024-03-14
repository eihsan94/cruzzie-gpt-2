/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { PrismaClient } from "@prisma/client";
import { AdditionalActionPrefetchEnum } from "../src/additionalAction/additionalActionEnum";

const prisma = new PrismaClient();
async function main() {
  await prisma.appChannel.deleteMany();
  await prisma.additionalAction.deleteMany();
  await prisma.trigger.deleteMany();
  await prisma.action.deleteMany();
  await prisma.useCase.deleteMany();
  await prisma.automationHistory.deleteMany();
  await prisma.automation.deleteMany();
  await prisma.automationTrigger.deleteMany();
  await prisma.automationAction.deleteMany();
  await prisma.automationUseCase.deleteMany();
  await prisma.app.deleteMany();

  const slack = await prisma.trigger.create({
    data: {
      appName: "slack",
      event: "New Message Posted to Channel",
      eventDescription:
        "Triggers when a new message is posted to a specific #channel you choose.",
      oAuth2:
        "https://slack.com/oauth/v2/authorize?client_id=4408858861143.5007720135701&scope=channels:manage,channels:read,channels:join,chat:write,chat:write.customize,chat:write.public,commands,files:write,im:write,mpim:write,team:read,users.profile:read,users:read,users:read.email,workflow.steps:execute&user_scope=channels:history,channels:read,channels:write,chat:write,emoji:read,files:read,files:write,groups:history,groups:read,groups:write,im:write,mpim:write,reactions:read,reminders:write,search:read,stars:read,team:read,users.profile:write,users:read,users:read.email",
      imageUrl:
        "https://zapier-images.imgix.net/storage/services/6cf3f5a461feadfba7abc93c4c395b33_2.png?auto=format&fit=crop&ixlib=react-9.7.0&q=50&w=30&h=30&dpr=2",
      logicEndpoint: "/api/v1/integrations/slack/new-message-posted-to-channel",
    },
  });

  const notion = await prisma.action.create({
    data: {
      appName: "notion",
      event: "Create Database Item",
      eventDescription: "Creates an item in a database",
      oAuth2:
        "https://api.notion.com/v1/oauth/authorize?client_id=b6fe4c21-06ab-4d62-a892-e8557a9964ba&response_type=code&owner=user",
      imageUrl:
        "https://zapier-images.imgix.net/storage/services/0de44c7d5f0046873886168b9b498f66_3.png?auto=format&fit=crop&ixlib=react-9.7.0&q=50&w=30&h=30&dpr=2",
      logicEndpoint: "/api/v1/actions/notion/create-database-item",
      additionalActions: {
        createMany: {
          data: [
            {
              name: "Choose Page",
              type: "select",
              options: "[]",
              label: "Choose the page that you want to add the data to",
              placeholder: "Choose your notion page",
              prefetchFnEnum: AdditionalActionPrefetchEnum.NOTION_FETCH_DB,
              value: "",
            },
          ],
        },
      },
    },
  });

  const slackApp = await prisma.app.create({
    data: {
      name: "slack",
    },
  });
  const notionApp = await prisma.app.create({
    data: {
      name: "notion",
    },
  });

  await prisma.useCase.create({
    data: {
      name: "Save new Slack channel messages to databases in Notion",
      logicEndpoint:
        "/api/v1/useCase/save-new-slack-channel-messages-to-databases-in-notion",
      trigger: {
        connect: {
          id: slack.id,
        },
      },
      actions: {
        connect: {
          id: notion.id,
        },
      },
      apps: {
        connect: [{ id: slackApp.id }, { id: notionApp.id }],
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
