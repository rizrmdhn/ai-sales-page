import { z } from "zod";

const schema = z.object({
  VITE_SERVER_URL: z.string().url(),
});

export const env = schema.parse((import.meta as any).env);
