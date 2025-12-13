import { createYoga } from "graphql-yoga";
import type { Context as HonoContext } from "hono";
import { schema } from "./schema";
import { createContext } from "./context";
import { env } from "../config/env";
import { createComplexityPlugin } from "./plugins/complexity";
import { createDepthLimitPlugin } from "./plugins/depth-limit";
import { createRateLimiterPlugin } from "./plugins/rate-limiter";

// Create GraphQL Yoga instance
export const yoga = createYoga({
  schema,
  context: createContext,

  // Plugins for query protection
  plugins: [
    createDepthLimitPlugin(env.GRAPHQL_MAX_DEPTH),
    createComplexityPlugin(env.GRAPHQL_MAX_COMPLEXITY),
    createRateLimiterPlugin(
      env.GRAPHQL_RATE_LIMIT_PER_MINUTE,
      env.GRAPHQL_RATE_LIMIT_PER_HOUR
    ),
  ],

  // GraphiQL configuration (disable in production)
  graphiql:
    env.NODE_ENV === "development"
      ? {
          title: "Device Capabilities API",
          defaultQuery: `
# Welcome to Device Capabilities GraphQL API!
# 
# Query Protection:
# - Max depth: 5 levels
# - Max complexity: 1000 points
# - Rate limit: 100 requests/minute, 1000 requests/hour
#
# Try these queries:

# 1. Simple device query
query GetDevice {
  device(id: "1") {
    vendor
    modelNum
    software {
      name
    }
  }
}

# 2. Search devices
query SearchDevices {
  devices(vendor: "Apple") {
    vendor
    modelNum
    marketName
  }
}

# 3. Capability search
query DevicesByBand {
  devicesByBand(bandId: "25") {
    device {
      vendor
      modelNum
    }
    supportStatus
  }
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
