# Video Script — AI Sales Page Generator Walkthrough

**Target length:** 5–7 minutes  
**Format:** Screen recording with voiceover

---

## [0:00 – 0:30] Intro

> "Hi, welcome to the demo of AI Sales Page — an AI-powered sales page generator. In this video I'll show you how the app works, walk through the tech stack, and explain the key decisions behind how it's built. Let's get started."

Show: landing/login page of the app.

---

## [0:30 – 1:30] Live Demo (User Flow)

> "First I'll show you what the app actually does before we go into the code."

1. Log in with a test account
2. Navigate to **New Page**
3. Fill in the form:
   - Product Name: `FlowDesk Pro`
   - Description: `An AI-powered CRM that automates follow-ups and tracks every customer interaction in one place.`
   - Features:
     - `Automated email follow-ups`
     - `Real-time pipeline analytics`
     - `One-click meeting scheduling`
     - `AI-generated call summaries`
   - Target Audience: `Small to mid-size B2B sales teams looking to close more deals with less manual work`
   - Price: `$49/month per seat`
   - USP: `The only CRM that writes your follow-up emails for you — saving reps 5+ hours per week`
4. Hit **Generate**
5. Show loading state (status: pending)
6. Page loads — show the rendered result: headline, benefits, features, CTA
7. Jump to dashboard — show the card with "generated" status

> "That's the full user flow. Now let's look at how it's built."

---

## [1:30 – 2:15] Project Structure

> "The project is a Turborepo monorepo. Two apps — a React frontend and a Hono backend — plus a set of shared packages."

Show: file tree in the editor

> "The key packages are:
> - `packages/ai` — the Groq prompt and generation logic
> - `packages/api` — tRPC routers for auth and sales pages
> - `packages/schema` — Zod schemas shared by both frontend and backend
> - `packages/db` — Drizzle ORM schema and queries"

---

## [2:15 – 3:15] Data Flow — Frontend to Backend

> "When the user submits the form, here's what happens."

Show: `apps/web/src/routes/(core)/new-page.tsx`

> "React Hook Form handles the form state. On submit, it fires a tRPC mutation — `salesPage.create` — passing the validated input."

Show: `packages/api/src/routers/sales-page.ts` — `create` procedure

> "On the backend, we first write a record to the database with status `pending`. Then we call `generateSalesPage()`. If that succeeds, we update the record to `generated` and store the AI response as JSONB. If it fails, the status becomes `failed` — and the user can retry from the dashboard."

---

## [3:15 – 4:15] The AI Layer

> "The AI logic lives entirely in `packages/ai`."

Show: `packages/ai/src/prompt.ts`

> "The system prompt tells the model it's a professional copywriter. The user message injects all six product fields and specifies exactly what JSON structure to return — headline, sub-headline, benefits array, features with titles and descriptions, social proof, pricing, and a CTA."

Show: `packages/ai/src/index.ts`

> "We use the Groq SDK with `llama-3.3-70b-versatile`. The `response_format` is set to `json_object` — this forces the model to return valid JSON rather than free-form text. We parse the response and return it typed as `GeneratedContent`."

---

## [4:15 – 5:00] Type Safety End-to-End

> "One of the things this stack does well is type safety all the way through."

Show: `packages/schema/src/prompt.schema.ts` → `packages/api` input validation → frontend form

> "`promptSchema` is defined once with Zod and used for both frontend validation and backend parsing via tRPC. The `GeneratedContent` type flows from the DB type definition through tRPC to the frontend component — no manual casting anywhere."

Show: `packages/db/src/types.ts` and `apps/web/src/routes/(core)/sales-pages/$id.tsx`

> "The frontend just destructures the typed response and renders each section."

---

## [5:00 – 5:30] Auth & Dashboard

> "Authentication uses short-lived JWT access tokens (15 minutes) paired with refresh tokens stored in the database — so sessions can be revoked on logout."

Show: `packages/auth/src/index.ts` briefly

> "Every tRPC route that touches sales pages uses a `protectedProcedure` — it verifies the JWT and attaches the user to context before the handler runs."

Show: dashboard briefly — search, delete, retry buttons

> "The dashboard lets users search their pages, delete them, or retry any that failed — without re-entering the product details."

---

## [5:30 – 6:00] Wrap Up

> "To summarize: the user fills in 6 fields, tRPC sends them to the server, Groq generates structured JSON, and the frontend renders a complete sales page. The whole thing is type-safe from the database to the UI, built on React, Hono, tRPC, Drizzle, and Groq."

> "Thanks for watching."

Show: final generated sales page on screen.

---

## Recording Notes

- Keep terminal/editor font large (16pt+)
- Pause 1–2 seconds on each file before speaking
- Highlight the specific lines being discussed
- Keep the demo data realistic — avoid "test123" as product names
