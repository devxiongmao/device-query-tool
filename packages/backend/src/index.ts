import app from "./app";
import { env } from "./config/env";
import { testConnection } from "./db/client";

// Test database connection on startup
await testConnection();

const server = Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
});

console.log("🚀 Server started");
console.log(`📡 Listening on http://localhost:${server.port}`);
console.log(`🌍 Environment: ${env.NODE_ENV}`);
console.log(`🔧 CORS enabled for: ${env.CORS_ORIGIN}`);

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down gracefully...");
  process.exit(0);
});
