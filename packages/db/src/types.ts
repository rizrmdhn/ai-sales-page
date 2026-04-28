import { InferSelectModel } from "drizzle-orm";
import { salesPages } from "./schema";

export type SalesPage = InferSelectModel<typeof salesPages>;
