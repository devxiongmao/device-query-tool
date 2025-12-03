import app from './app';
import { env } from './config/env';

const server = Bun.serve({
  port: env.PORT,
  fetch: app.fetch,
});

console.log('🚀 Server started');
console.log(`📡 Listening on http://localhost:${server.port}`);
console.log(`🌍 Environment: ${env.NODE_ENV}`);
console.log(`🔧 CORS enabled for: ${env.CORS_ORIGIN}`);