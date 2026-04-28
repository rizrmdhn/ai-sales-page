import { createAccessToken } from "@ai-sales-page/auth";
import { getUserByEmail } from "@ai-sales-page/queries/users.queries";
import { loginSchema } from "@ai-sales-page/schema/auth.schema";
import { tryCatchAsync } from "@ai-sales-page/utils/try-catch";
import { verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "..";
import { toTRPCError } from "../utils/to-trpc-error";

export const authRouter = createTRPCRouter({
  login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
    const [user, err] = await tryCatchAsync(() => getUserByEmail(input.email));

    if (err) throw toTRPCError(err);

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });

    const [isPasswordValid, passwordErr] = await tryCatchAsync(() =>
      verify(user.password, input.password),
    );

    if (passwordErr) throw toTRPCError(passwordErr);

    if (!isPasswordValid)
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid password",
      });

    const [accessToken, accessTokenErr] = await tryCatchAsync(() =>
      createAccessToken({
        email: user.email,
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt ? user.updatedAt : null,
      }),
    );

    if (accessTokenErr) throw toTRPCError(accessTokenErr);

    return { accessToken };
  }),
});
