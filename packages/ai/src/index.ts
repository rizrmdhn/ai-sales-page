import { env } from "@ai-sales-page/env/server";
import type { PromptInput } from "@ai-sales-page/schema/prompt.schema";
import { GoogleGenAI } from "@google/genai";
import { prompt } from "./prompt";

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export async function generateSalesPage(input: PromptInput) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt(input),
  });

  return JSON.parse(response.text ?? "{}");
}
