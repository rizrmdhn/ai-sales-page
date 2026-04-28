import { generateSalesPage } from "@ai-sales-page/ai";
import {
  createSalesPage,
  getAllUserSalesPages,
  getSalesPageByIdAndUserId,
  updateSalesPageStatus,
} from "@ai-sales-page/queries/sales-pages.queries";
import { promptSchema } from "@ai-sales-page/schema/prompt.schema";
import { tryCatchAsync } from "@ai-sales-page/utils/try-catch";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { createTRPCRouter, protectedProcedure } from "..";
import { toTRPCError } from "../utils/to-trpc-error";

export const salesPageRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    const [salesPages, error] = await tryCatchAsync(() =>
      getAllUserSalesPages(ctx.user.id),
    );

    if (error) throw toTRPCError(error);

    return salesPages;
  }),

  create: protectedProcedure
    .input(promptSchema)
    .mutation(async ({ ctx, input }) => {
      const [pending, createError] = await tryCatchAsync(() =>
        createSalesPage({
          ...input,
          userId: ctx.user.id,
          status: "pending",
        }),
      );

      if (createError) throw toTRPCError(createError);

      const [generatedContent, genError] = await tryCatchAsync(() =>
        generateSalesPage(input),
      );

      if (genError) {
        await updateSalesPageStatus(pending.id, "failed");
        throw toTRPCError(genError);
      }

      const [salesPage, updateError] = await tryCatchAsync(() =>
        updateSalesPageStatus(pending.id, "generated", generatedContent),
      );

      if (updateError) throw toTRPCError(updateError);

      return salesPage;
    }),

  detail: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [salesPage, error] = await tryCatchAsync(() =>
        getSalesPageByIdAndUserId(input.id, ctx.user.id),
      );

      if (error) throw toTRPCError(error);

      if (!salesPage)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Sales page not found",
        });

      if (salesPage.userId !== ctx.user.id)
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not the owner of this sales page",
        });

      return salesPage;
    }),
});
