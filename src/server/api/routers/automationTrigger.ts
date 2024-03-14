import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { automationTriggerUpdateModel } from "~/server/models/automationTrigger.model";

export const automationTriggerRouter = createTRPCRouter({
  update: protectedProcedure
    .input(automationTriggerUpdateModel)
    .mutation(({ input, ctx }) => {
      const automationTrigger = input.body;
      try {
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

        return ctx.prisma.automationTrigger.update({
          where: { id: input.params.id },
          data: transformedAutomationTrigger,
        });
      } catch (error) {
        throw new Error(JSON.stringify(error));
      }
    }),

  updateTriggerChannel: protectedProcedure
    .input(automationTriggerUpdateModel)
    .mutation(async ({ input, ctx }) => {
      const automationTrigger = input.body;
      try {
        // Delete all related channels
        await ctx.prisma.appChannel.deleteMany({
          where: {
            automationTriggerId: input.params.id,
          },
        });

        // Update the automation trigger with the new channels
        return ctx.prisma.automationTrigger.update({
          where: { id: input.params.id },
          data: {
            appChannels: {
              createMany: {
                data:
                  automationTrigger.appChannels?.map((a) => ({
                    channelId: a.channelId,
                    name: a.name,
                  })) || [],
              },
            },
          },
        });
      } catch (error) {
        throw new Error(JSON.stringify(error));
      }
    }),
});
