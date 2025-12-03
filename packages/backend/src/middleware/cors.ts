import { cors as honoCors } from 'hono/cors';
import { env } from '../config/env';

export const cors = honoCors({
  origin: env.CORS_ORIGIN,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});