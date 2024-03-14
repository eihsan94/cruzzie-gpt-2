import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { automationActionUpdateModel } from "~/server/models/automationAction.model";

export const automationActionRouter = createTRPCRouter({
  updateActionChannel: protectedProcedure
    .input(automationActionUpdateModel)
    .mutation(async ({ input, ctx }) => {
      const automationAction = input.body;
      try {
        // Delete all related channels
        await ctx.prisma.appChannel.deleteMany({
          where: {
            automationActionId: input.params.id,
          },
        });

        // Update the automation action with the new channels
        return ctx.prisma.automationAction.update({
          where: { id: input.params.id },
          data: {
            appChannels: {
              createMany: {
                data:
                  automationAction.appChannels?.map((a) => ({
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
