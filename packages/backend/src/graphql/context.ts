import type { YogaInitialContext } from 'graphql-yoga';
import type { db } from '../db/client';

// Define the shape of our GraphQL context
export interface GraphQLContext extends YogaInitialContext {
  db: typeof db;
  // Future: add loaders, user auth, etc.
  // loaders: ReturnType<typeof createLoaders>;
  // userId?: string;
}

// Context factory - creates context for each request
export async function createContext(initialContext: YogaInitialContext): Promise<GraphQLContext> {
  // Import db dynamically to avoid circular dependencies
  const { db } = await import('../db/client');
  
  return {
    ...initialContext,
    db,
  };
}