import { gql } from "./generated";

// Re-export the gql tag from generated code
// This is typed and will provide autocomplete!
export { gql };

// Re-export hooks
export * from "./generated/hooks";

// Re-export types
export type * from "./generated/schema";
