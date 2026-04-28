import { z } from "zod";

export const promptSchema = z.object({
  productName: z.string(),
  description: z.string(),
  features: z.array(z.string()),
  targetAudience: z.string(),
  price: z.string(),
  usp: z.string(),
});

export type PromptInput = z.infer<typeof promptSchema>;
