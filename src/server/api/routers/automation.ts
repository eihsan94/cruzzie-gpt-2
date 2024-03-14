import { string } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  automationModel,
  automationUpdateModel,
} from "~/server/models/automation.model";
import {
  getAutomationByIdQuery,
  getAutomationsQuery,
} from "~/server/api/prismaQuery/automationQuery";

export const automationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.automation.findMany(getAutomationsQuery());
  }),

  getCurrUserAutomations: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session?.user.id },
      include: {
        automations: getAutomationsQuery(),
      },
    });
  }),

  getById: protectedProcedure.input(string()).query(({ input, ctx }) => {
    return ctx.prisma.automation.findUnique({
      ...getAutomationByIdQuery(input),
    });
  }),

  update: protectedProcedure
    .input(automationUpdateModel)
    .mutation(({ input, ctx }) => {
      const { name, automationUseCase } = input.body;
      const { automationActions, automationTrigger, ...rest } =
        automationUseCase;

      const transformedAutomationTrigger = {
        ...automationTrigger,
        additionalActions: {
          upsert: automationTrigger.additionalActions?.map((action) => ({
            where: { id: action.id },
            create: action,
            update: action,
          })),
        },
        appChannels: {
          upsert: automationTrigger.appChannels?.map((channel) => ({
            where: { id: channel.id },
            create: channel,
            update: channel,
          })),
        },
      };

      return ctx.prisma.automation.update({
        where: { id: input.params.id },
        data: {
          name,
          automationUseCase: {
            update: {
              ...rest,
              automationTrigger: {
                update: transformedAutomationTrigger,
              },
              automationActions: {
                updateMany: automationActions.map((action) => ({
                  where: { id: action.id },
                  data: action,
                })),
              },
            },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(automationModel)
    .mutation(async ({ input, ctx }) => {
      const { name, automationUseCase } = input;
      const { automationActions, automationTrigger, ...rest } =
        automationUseCase;
      const transformedAutomationTrigger = {
        ...automationTrigger,
        additionalActions: {
          create: automationTrigger.additionalActions,
        },
        appChannels: {
          create: automationTrigger.appChannels,
        },
      };

      const createdAutomationActions = await ctx.prisma.$transaction(
        automationActions.map((a) =>
          ctx.prisma.automationAction.create({
            data: {
              appName: a.appName,
              event: a.event,
              eventDescription: a.eventDescription,
              oAuth2: a.oAuth2,
              imageUrl: a.imageUrl,
              logicEndpoint: a.logicEndpoint,
              additionalActions: {
                createMany: {
                  data:
                    a.additionalActions?.map((d) => ({
                      ...d,
                    })) || [],
                },
              },
            },
          })
        )
      );

      try {
        const automation = await ctx.prisma.automation.create({
          data: {
            name,
            automationUseCase: {
              create: {
                automationTrigger: {
                  create: transformedAutomationTrigger,
                },
                automationActions: {
                  connect: createdAutomationActions.map((action) => ({
                    id: action.id,
                  })),
                },
                ...rest,
              },
            },
          },
          select: {
            id: true,
          },
        });
        await ctx.prisma.user.update({
          where: { id: ctx.session?.user.id },
          data: {
            automations: {
              connect: {
                id: automation.id,
              },
            },
          },
        });
        return {
          response: automation,
          err: null,
        };
      } catch (err) {
        console.log(err);
        throw new Error(err as string);
      }
    }),
});
