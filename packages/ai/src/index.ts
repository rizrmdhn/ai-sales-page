import { env } from "@ai-sales-page/env/server";
import type { PromptInput } from "@ai-sales-page/schema/prompt.schema";
import type { GeneratedContent } from "@ai-sales-page/types/generated-content.types";
import Groq from "groq-sdk";
import { prompt } from "./prompt";

const groq = new Groq({ apiKey: env.GROQ_API_KEY });

export async function generateSalesPage(
  input: PromptInput,
): Promise<GeneratedContent> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt(input) }],
    response_format: { type: "json_object" },
  });

  const text = response.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text) as GeneratedContent;
}
