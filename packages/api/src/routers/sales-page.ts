import { generateSalesPage } from "@ai-sales-page/ai";
import {
  createSalesPage,
  deleteSalesPage,
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
  list: protectedProcedure
    .input(
      z.object({
        search: z.optional(z.string()),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [salesPages, error] = await tryCatchAsync(() =>
        getAllUserSalesPages(ctx.user.id, input.search),
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
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [salesPage, error] = await tryCatchAsync(() =>
        getSalesPageByIdAndUserId(input.id, ctx.user.id),
      );

      if (error) throw toTRPCError(error);

      if (!salesPage)
        throw new TRPCError({ code: "NOT_FOUND", message: "Sales page not found" });

      if (salesPage.userId !== ctx.user.id)
        throw new TRPCError({ code: "FORBIDDEN", message: "You are not the owner of this sales page" });

      return salesPage;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [existing, fetchError] = await tryCatchAsync(() =>
        getSalesPageByIdAndUserId(input.id, ctx.user.id),
      );
      if (fetchError) throw toTRPCError(fetchError);
      if (!existing)
        throw new TRPCError({ code: "NOT_FOUND", message: "Sales page not found" });

      const [, deleteError] = await tryCatchAsync(() =>
        deleteSalesPage(input.id),
      );
      if (deleteError) throw toTRPCError(deleteError);
    }),

  retry: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [existing, fetchError] = await tryCatchAsync(() =>
        getSalesPageByIdAndUserId(input.id, ctx.user.id),
      );
      if (fetchError) throw toTRPCError(fetchError);
      if (!existing)
        throw new TRPCError({ code: "NOT_FOUND", message: "Sales page not found" });

      const promptInput = {
        productName: existing.productName,
        description: existing.description,
        features: existing.features,
        targetAudience: existing.targetAudience,
        price: existing.price,
        usp: existing.usp ?? "",
      };

      await updateSalesPageStatus(input.id, "pending");

      const [generatedContent, genError] = await tryCatchAsync(() =>
        generateSalesPage(promptInput),
      );
      if (genError) {
        await updateSalesPageStatus(input.id, "failed");
        throw toTRPCError(genError);
      }

      const [salesPage, updateError] = await tryCatchAsync(() =>
        updateSalesPageStatus(input.id, "generated", generatedContent),
      );
      if (updateError) throw toTRPCError(updateError);
      return salesPage;
    }),
});
