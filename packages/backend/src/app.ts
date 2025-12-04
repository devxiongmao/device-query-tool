import { Hono } from 'hono';
import { cors } from './middleware/cors';
import { logger } from './middleware/logger';
import { errorHandler } from './middleware/error-handler';
import { env } from './config/env'
;

const app = new Hono();

// Middleware
app.use('*', cors);
app.use('*', logger);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    database: 'not connected yet', // Will update in Task 2
  });
});

// Root endpoint
app.get('/', (c) => {
  return c.json({
    message: 'Device Capabilities API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      graphql: '/graphql', // Coming in Slice 2
    },
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404);
});

// Global error handler
app.onError(errorHandler);

export default app;