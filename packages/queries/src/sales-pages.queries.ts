import { eq, InferInsertModel } from "@ai-sales-page/db";
import { db } from "@ai-sales-page/db/client";
import { salesPages } from "@ai-sales-page/db/schema";
import { NotFoundError, QueryError } from "./errors";

type GeneratedContent = NonNullable<InferInsertModel<typeof salesPages>["generatedContent"]>;

export async function getAllUserSalesPages(userId: string) {
  const salesPages = await db.query.salesPages.findMany({
    where: (salesPages, { eq }) => eq(salesPages.userId, userId),
  });

  return salesPages;
}

export async function getSalesPageByIdAndUserId(id: string, userId: string) {
  const salesPage = await db.query.salesPages.findFirst({
    where: (salesPages, { eq, and }) =>
      and(eq(salesPages.id, id), eq(salesPages.userId, userId)),
  });

  return salesPage;
}

export async function getSalesPageById(id: string) {
  const salesPage = await db.query.salesPages.findFirst({
    where: (salesPages, { eq }) => eq(salesPages.id, id),
  });

  return salesPage;
}

export async function createSalesPage(
  data: InferInsertModel<typeof salesPages>,
) {
  const [newSalesPage] = await db.insert(salesPages).values(data).returning();

  if (!newSalesPage) throw new QueryError("Failed to create sales page");

  return newSalesPage;
}

export async function updateSalesPageStatus(
  id: string,
  status: "pending" | "generated" | "failed",
  generatedContent?: GeneratedContent,
) {
  const [updated] = await db
    .update(salesPages)
    .set({ status, generatedContent })
    .where(eq(salesPages.id, id))
    .returning();

  if (!updated) throw new QueryError("Failed to update sales page status");

  return updated;
}

export async function deleteSalesPage(id: string) {
  const isExisting = await getSalesPageById(id);

  if (!isExisting) throw new NotFoundError("Sales Page", id);

  const [result] = await db
    .delete(salesPages)
    .where(eq(salesPages.id, id))
    .returning();

  if (!result) throw new QueryError("Failed to delete sales page");

  return result;
}
