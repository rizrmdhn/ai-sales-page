import { GeneratedContent } from "@ai-sales-page/types/generated-content.types";
import { index, jsonb, text, uuid } from "drizzle-orm/pg-core";
import { v7 as uuidv7 } from "uuid";
import { createTable, timestamps } from "./utils";

export const users = createTable(
  "users",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .$default(() => uuidv7()),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    ...timestamps,
  },
  (table) => [
    index("idx_users_email").on(table.email),
    index("idx_users_id").on(table.id),
  ],
);

export const salesPages = createTable(
  "sales_pages",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // input dari user
    productName: text("product_name").notNull(),
    description: text("description").notNull(),
    features: text("features").array().notNull(), // ["feature1", "feature2"]
    targetAudience: text("target_audience").notNull(),
    price: text("price").notNull(),
    usp: text("usp"), // unique selling point

    // output dari AI
    generatedContent: jsonb("generated_content").$type<GeneratedContent>(), // structured JSON
    status: text("status", {
      enum: ["pending", "generated", "failed"],
    }).default("pending"),

    ...timestamps,
  },

  (table) => [
    index("idx_sales_pages_user_id").on(table.userId),
    index("idx_sales_pages_status").on(table.status),
  ],
);
