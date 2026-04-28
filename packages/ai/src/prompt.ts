import { PromptInput } from "@ai-sales-page/schema/prompt.schema";

export const prompt = (input: PromptInput) => `
You are a professional copywriter. Generate a complete sales page for the following product.
Return ONLY valid JSON, no markdown, no explanation.

Product Info:
- Name: ${input.productName}
- Description: ${input.description}
- Features: ${input.features.join(", ")}
- Target Audience: ${input.targetAudience}
- Price: ${input.price}
- Unique Selling Point: ${input.usp}

Return this exact JSON structure:
{
  "headline": "",
  "subHeadline": "",
  "productDescription": "",
  "benefits": [],
  "features": [{ "title": "", "description": "" }],
  "socialProof": "",
  "pricing": { "label": "", "price": "", "note": "" },
  "cta": { "text": "", "subText": "" }
}
`;
