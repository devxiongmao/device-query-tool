import type { Context } from 'hono';
import { env } from '../config/env';

export const errorHandler = (err: Error, c: Context) => {
  console.error('❌ Error:', err);

  // Don't leak error details in production
  const isDevelopment = env.NODE_ENV === 'development';

  return c.json(
    {
      error: {
        message: isDevelopment ? err.message : 'Internal Server Error',
        ...(isDevelopment && { stack: err.stack }),
      },
    },
    500
  );
};