import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getSession: protectedProcedure.query(({ ctx }) => ctx.session),
});
