import { GeneratedContent } from "@ai-sales-page/types/generated-content.types";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  jsonb,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
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

export const refreshTokens = createTable(
  "refresh_tokens",
  {
    id: uuid("id")
      .primaryKey()
      .notNull()
      .$default(() => uuidv7()),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    deviceInfo: text("device_info"),
    os: text("os"),
    version: varchar("version", { length: 100 }),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    lastUsedAt: timestamp("last_used_at", {
      withTimezone: true,
      mode: "string",
    }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    revoked: boolean("revoked").notNull().default(false),
    revokedAt: timestamp("revoked_at", {
      withTimezone: true,
      mode: "string",
    }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    })
      .$default(() => sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => [
    index("refresh_token_user_id_idx").using("btree", table.userId),
    index("refresh_token_token_idx").using("btree", table.token),
    index("refresh_token_expires_at_idx").using("btree", table.expiresAt),
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
