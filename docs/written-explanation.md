# Written Explanation — AI Sales Page Generator

## Overview

This project is a full-stack AI-powered sales page generator. Users input basic product details and the system produces a fully written, structured sales page using a large language model. Everything is persisted per user behind authentication.

---

## Approach

The core idea is to keep the user's input minimal (6 fields) and let the AI do the heavy lifting of copywriting. The generated output is structured JSON — not free-form text — so the frontend can render each section (headline, benefits, CTA, etc.) independently and consistently.

A status machine (`pending → generated | failed`) handles async generation and allows users to retry failed pages without re-entering their data.

---

## Tools & Stack

| Layer | Tool |
|---|---|
| Monorepo | Turborepo + pnpm |
| Frontend | React 19, TanStack Router, TailwindCSS, shadcn/ui |
| Backend | Hono, tRPC |
| Database | PostgreSQL, Drizzle ORM |
| AI | Groq API (llama-3.3-70b-versatile) |
| Auth | JWT (access + refresh tokens), Argon2 password hashing |
| Validation | Zod (shared schemas across frontend and backend) |
| Runtime | Bun |

---

## Project Structure

```
ai-sales-page/
├── apps/
│   ├── web/        # React frontend
│   └── server/     # Hono backend
└── packages/
    ├── ai/         # Groq prompt + generation logic
    ├── api/        # tRPC routers (auth, sales pages)
    ├── auth/       # JWT utilities
    ├── db/         # Drizzle schema, migrations, queries
    ├── schema/     # Zod validation schemas
    └── types/      # Shared TypeScript types
```

---

## Data Flow

```
User fills form (productName, description, features, targetAudience, price, usp)
        ↓
Zod validation (promptSchema)
        ↓
tRPC mutation → creates DB record with status: "pending"
        ↓
generateSalesPage() → Groq API call (llama-3.3-70b-versatile)
        ↓
AI returns structured JSON (headline, benefits, features, pricing, CTA...)
        ↓
DB record updated → status: "generated", generatedContent stored as JSONB
        ↓
Frontend renders each section from the structured response
```

---

## Key Logic

### AI Prompt (`packages/ai/src/prompt.ts`)
The system prompt instructs the model to act as a professional copywriter and return a strict JSON structure. Product details are interpolated into the user message. The Groq SDK enforces `response_format: { type: "json_object" }` to prevent free-form output.

### API Layer (`packages/api/src/routers/sales-page.ts`)
All routes are protected with JWT middleware. The `create` and `retry` procedures both call the same `generateSalesPage()` function — `retry` simply resets the status to `pending` and regenerates without requiring new input.

### Authentication (`packages/auth/src/index.ts`)
Short-lived access tokens (15 min) paired with long-lived refresh tokens (7 days). Refresh tokens are stored in the database so they can be revoked on logout.

### Type Safety
`promptSchema` (Zod) is defined once in `packages/schema` and used for both frontend form validation and backend input parsing via tRPC. `GeneratedContent` type flows from the DB type definition through tRPC to the frontend with no manual casting.

---

## Database Schema

Three tables:
- `users` — credentials, email, hashed password
- `refresh_tokens` — active sessions, tied to user + device
- `sales_pages` — input fields + `generatedContent` (JSONB) + `status`

---

## What Was Intentionally Kept Simple

- No streaming — the full response is awaited before saving
- No background job queue — generation runs inline with the HTTP request
- No multi-tenancy beyond per-user isolation
- Single AI provider (Groq) with no fallback
