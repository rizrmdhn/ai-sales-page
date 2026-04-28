import { relations } from "drizzle-orm";
import { salesPages, users } from "./schema";

export const userRelations = relations(users, ({ many }) => ({
  salesPages: many(salesPages),
}));

export const salesPageRelations = relations(salesPages, ({ one }) => ({
  user: one(users, {
    fields: [salesPages.userId],
    references: [users.id],
  }),
}));
