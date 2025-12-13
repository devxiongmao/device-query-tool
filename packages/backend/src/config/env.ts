import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_NAME: z.string().default('device_capabilities'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string(),

  // Server
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

  // GraphQL
  GRAPHQL_MAX_DEPTH: z.coerce.number().default(5),
  GRAPHQL_MAX_COMPLEXITY: z.coerce.number().default(1000),
  GRAPHQL_RATE_LIMIT_PER_MINUTE: z.coerce.number().default(100),
  GRAPHQL_RATE_LIMIT_PER_HOUR: z.coerce.number().default(1000),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.issues.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

export const env = loadEnv();