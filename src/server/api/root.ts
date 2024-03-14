import { createTRPCRouter } from "~/server/api/trpc";
import { automationRouter } from "./routers/automation";
import { automationActionRouter } from "./routers/automationAction";
import { automationTriggerRouter } from "./routers/automationTrigger";
import { userRouter } from "./routers/user";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  automation: automationRouter,
  automationTrigger: automationTriggerRouter,
  automationAction: automationActionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
