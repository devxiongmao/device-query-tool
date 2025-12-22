import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || "development";

if (nodeEnv === "test") {
  // Load .env.test for local testing (skip in CI as vars are already set)
  const isCI =
    process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
  if (!isCI) {
    dotenv.config({
      path: path.resolve(process.cwd(), ".env.test"),
      override: true,
    });
  }
} else {
  // Load .env for development
  dotenv.config({ path: path.resolve(process.cwd(), ".env"), override: true });
}

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config;
