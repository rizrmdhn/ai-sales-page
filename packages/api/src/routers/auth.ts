import { loginSchema } from "@ai-sales-page/schema/auth.schema";
import { createTRPCRouter, publicProcedure } from "..";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {}),
});
