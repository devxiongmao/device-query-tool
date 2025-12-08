import { builder } from './builder';

// Import all type definitions (we'll create these in next tasks)
// For now, we just have the basic Query and Mutation types from builder

// Build and export the schema
export const schema = builder.toSchema();