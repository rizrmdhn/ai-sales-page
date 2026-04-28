import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "@ai-sales-page/auth";
import { env } from "@ai-sales-page/env/server";
import {
  revokeRefreshToken,
  storeRefreshToken,
  validateRefreshToken,
} from "@ai-sales-page/queries/refresh-token.queries";
import {
  createUser,
  getUserByEmail,
  getUserById,
} from "@ai-sales-page/queries/users.queries";
import { loginSchema, registerSchema } from "@ai-sales-page/schema/auth.schema";
import { tryCatchAsync } from "@ai-sales-page/utils/try-catch";
import { hash, verify } from "@node-rs/argon2";
import { TRPCError } from "@trpc/server";
import { v7 as uuidv7 } from "uuid";
import z from "zod";
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

    const [refreshToken, refreshTokenErr] = await tryCatchAsync(() =>
      createRefreshToken({
        email: user.email,
        id: user.id,
        sessionId: uuidv7(),
        type: "refresh",
      }),
    );

    if (refreshTokenErr) throw toTRPCError(refreshTokenErr);

    const expiryDays = parseInt(env.JWT_REFRESH_TOKEN_EXPIRY.replace("d", ""));
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + expiryDays);

    const [_, storeRefreshTokenErr] = await tryCatchAsync(() =>
      storeRefreshToken({
        userId: user.id,
        token: refreshToken,
        expiresAt: refreshTokenExpiry.toISOString(),
      }),
    );

    if (storeRefreshTokenErr) throw toTRPCError(storeRefreshTokenErr);

    return { accessToken, refreshToken };
  }),

  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ input }) => {
      const passwordHash = await hash(input.password);

      const [result, err] = await tryCatchAsync(() =>
        createUser({
          ...input,
          passwordHash,
        }),
      );

      if (err) throw toTRPCError(err);

      return {
        ...result,
        password: undefined,
      };
    }),

  me: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user && !ctx.hasAuthHeader) {
      return null;
    }

    if (!ctx.user && ctx.hasAuthHeader) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid or expired access token",
      });
    }

    const [user, err] = await tryCatchAsync(() => getUserById(ctx.user!.id));

    if (err) throw toTRPCError(err);

    if (!user)
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });

    return {
      ...user,
      password: undefined,
    };
  }),

  refresh: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ input }) => {
      const [verifiedToken, verifyErr] = await tryCatchAsync(() =>
        verifyRefreshToken(input.token),
      );

      if (verifyErr) throw toTRPCError(verifyErr);

      if (!verifiedToken)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid refresh token",
        });

      const [storedToken, storedTokenErr] = await tryCatchAsync(() =>
        validateRefreshToken(input.token),
      );

      if (storedTokenErr) throw toTRPCError(storedTokenErr);

      if (!storedToken)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid refresh token",
        });

      const [user, userErr] = await tryCatchAsync(() =>
        getUserById(storedToken.id),
      );

      if (userErr) throw toTRPCError(userErr);

      if (!user)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
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

      const [newRefreshToken, newRefreshTokenErr] = await tryCatchAsync(() =>
        createRefreshToken({
          email: user.email,
          id: user.id,
          sessionId: uuidv7(),
          type: "refresh",
        }),
      );

      if (newRefreshTokenErr) throw toTRPCError(newRefreshTokenErr);

      if (!accessToken || !newRefreshToken)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create access or refresh token",
        });

      // Revoke the old refresh token
      const [_, revokeErr] = await tryCatchAsync(() =>
        revokeRefreshToken(input.token),
      );

      if (revokeErr) throw toTRPCError(revokeErr);

      // Store the new refresh token
      const expiryDays = parseInt(
        env.JWT_REFRESH_TOKEN_EXPIRY.replace("d", ""),
      );
      const refreshTokenExpiry = new Date();
      refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + expiryDays);

      const [__, storeRefreshTokenErr] = await tryCatchAsync(() =>
        storeRefreshToken({
          userId: user.id,
          token: newRefreshToken,
          expiresAt: refreshTokenExpiry.toISOString(),
        }),
      );

      if (storeRefreshTokenErr) throw toTRPCError(storeRefreshTokenErr);

      return { accessToken, refreshToken: newRefreshToken };
    }),
});
