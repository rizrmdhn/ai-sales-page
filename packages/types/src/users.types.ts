import { InferSelectModel } from "@ai-sales-page/db";
import { users } from "@ai-sales-page/db/schema";

export type User = Omit<InferSelectModel<typeof users>, "password">;
