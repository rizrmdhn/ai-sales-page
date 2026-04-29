import { InferSelectModel } from "@ai-sales-page/db";
import { salesPages } from "@ai-sales-page/db/schema";

export type SalesPage = InferSelectModel<typeof salesPages>;
