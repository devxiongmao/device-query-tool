import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

export default function setup() {
  // Load .env.test BEFORE any modules are imported
  const isCI =
    process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";

  if (!isCI) {
    const envTestPath = path.resolve(process.cwd(), ".env.test");

    if (fs.existsSync(envTestPath)) {
      console.log("📝 Loading .env.test for local testing");
      dotenv.config({
        path: envTestPath,
        override: true,
      });
    } else {
      console.warn(
        "⚠️  No .env.test file found. Using existing environment variables."
      );
    }
  } else {
    console.log("🔧 Running in CI - using environment variables from workflow");
  }
}
