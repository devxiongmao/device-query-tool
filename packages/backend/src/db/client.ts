import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { env } from '../config/env';
import * as schema from './schema';

// Create postgres connection
const queryClient = postgres(env.DATABASE_URL, {
  max: 10, // connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(queryClient, { schema });

// Test connection
export async function testConnection() {
  try {
    await queryClient`SELECT 1`;
    console.log('✅ Database connected successfully');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return false;
  }
}

// Graceful shutdown
export async function closeConnection() {
  await queryClient.end();
  console.log('🔌 Database connection closed');
}