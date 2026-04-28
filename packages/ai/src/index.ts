import { env } from "@ai-sales-page/env/server";
import type { PromptInput } from "@ai-sales-page/schema/prompt.schema";
import type { GeneratedContent } from "@ai-sales-page/types/generated-content.types";
import { GoogleGenAI } from "@google/genai";
import { prompt } from "./prompt";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export async function generateSalesPage(
  input: PromptInput,
): Promise<GeneratedContent> {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-lite",
    contents: prompt(input),
  });

  return JSON.parse(response.text ?? "{}") as GeneratedContent;
}
