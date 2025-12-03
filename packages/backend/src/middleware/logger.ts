import { Context, Next } from 'hono';
import { env } from '../config/env';

export const logger = async (c: Context, next: Next) => {
  const start = Date.now();
  const method = c.req.method;
  const path = c.req.path;

  await next();

  const elapsed = Date.now() - start;
  const status = c.res.status;

  // Color code based on status
  const statusColor = status >= 500 ? '🔴' : status >= 400 ? '🟡' : '🟢';

  if (env.LOG_LEVEL === 'debug' || env.LOG_LEVEL === 'info') {
    console.log(`${statusColor} ${method} ${path} - ${status} (${elapsed}ms)`);
  }
};