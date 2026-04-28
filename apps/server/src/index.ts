import { createTRPCContext } from "@ai-sales-page/api";
import { appRouter } from "@ai-sales-page/api/root";
import { env } from "@ai-sales-page/env/server";
import { serve } from "@hono/node-server";
import { trpcServer } from "@hono/trpc-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: env.CORS_ORIGIN,
    allowMethods: ["GET", "POST", "OPTIONS"],
  }),
);

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createTRPCContext(context);
    },
  }),
);

app.get("/", (c) => {
  return c.text("OK");
});

serve({ fetch: app.fetch, port: 3000 });
