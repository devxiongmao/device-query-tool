import type { YogaInitialContext } from "graphql-yoga";
import type { db } from "../db/client";
import type { Loaders } from "./loaders";
import { createLoaders } from "./loaders";

// Define the shape of our GraphQL context
export interface GraphQLContext extends YogaInitialContext {
  db: typeof db;
  loaders: Loaders;
}

// Context factory - creates context for each request
export async function createContext(
  initialContext: YogaInitialContext
): Promise<GraphQLContext> {
  // Import db dynamically to avoid circular dependencies
  const { db } = await import("../db/client");

  return {
    ...initialContext,
    db,
    loaders: createLoaders(),
  };
}
