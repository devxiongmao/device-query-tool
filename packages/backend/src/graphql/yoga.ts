import { createYoga } from "graphql-yoga";
import type { Context as HonoContext } from "hono";
import { schema } from "./schema";
import { createContext } from "./context";
import { env } from "../config/env";

// Create GraphQL Yoga instance
export const yoga = createYoga({
  schema,
  context: createContext,

  // GraphiQL configuration (disable in production)
  graphiql:
    env.NODE_ENV === "development"
      ? {
          title: "Device Capabilities API",
          defaultQuery: `
# Welcome to Device Capabilities GraphQL API!
# 
# Try this query:
query TestQuery {
  hello
}
    `.trim(),
        }
      : false,

  // Logging
  logging: {
    debug: (...args) => {
      if (env.LOG_LEVEL === "debug") {
        console.log("[GraphQL Debug]", ...args);
      }
    },
    info: (...args) => {
      if (["debug", "info"].includes(env.LOG_LEVEL)) {
        console.log("[GraphQL Info]", ...args);
      }
    },
    warn: (...args) => console.warn("[GraphQL Warn]", ...args),
    error: (...args) => console.error("[GraphQL Error]", ...args),
  },

  // CORS is already handled by Hono middleware
  cors: false,
});

// Helper function to integrate with Hono
export async function handleGraphQLRequest(c: HonoContext) {
  const response = await yoga.handleRequest(c.req.raw, {});

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}

// Health check handler
export function handleGraphQLHealth(c: HonoContext) {
  return c.json({ data: "graphQL is healthy!" });
}
