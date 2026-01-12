import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default("device_capabilities"),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string(),

  // Server
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  // CORS
  CORS_ORIGIN: z.string().default("http://localhost:5173"),

  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),

  // GraphQL
  GRAPHQL_MAX_DEPTH: z.coerce.number().default(5),
  GRAPHQL_MAX_COMPLEXITY: z.coerce.number().default(1000),
  GRAPHQL_RATE_LIMIT_PER_MINUTE: z.coerce.number().default(100),
  GRAPHQL_RATE_LIMIT_PER_HOUR: z.coerce.number().default(1000),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

function loadEnv(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  try {
    const parsed = envSchema.parse(process.env);
    cachedEnv = parsed;
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:");
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join(".")}: ${err.message}`);
      });

      // In test environment, throw instead of exiting
      if (process.env.NODE_ENV === "test") {
        throw new Error("Environment validation failed in tests");
      }

      process.exit(1);
    }
    throw error;
  }
}

export function getEnv(): Env {
  return loadEnv();
}

// Helper function to reset cache (for testing only)
export function resetEnvCache(): void {
  cachedEnv = null;
}

// Helper function to override env values (for testing only)
export function setEnvForTest(overrides: Partial<Env>): void {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("setEnvForTest can only be used in test environment");
  }
  cachedEnv = { ...loadEnv(), ...overrides };
}

// Use a Proxy to lazy-load env values
export const env = new Proxy({} as Env, {
  get(_target, prop) {
    const loadedEnv = loadEnv();
    return loadedEnv[prop as keyof Env];
  },
  set(_target, prop, value) {
    // Allow setting in test environment only
    if (process.env.NODE_ENV === "test") {
      if (!cachedEnv) {
        loadEnv(); // Ensure cache is initialized
      }
      if (cachedEnv && typeof prop === "string") {
        (cachedEnv as Record<string, unknown>)[prop] = value;
      }
      return true;
    }
    throw new Error("Cannot modify env outside of test environment");
  },
});
