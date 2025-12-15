import type { Plugin } from "graphql-yoga";
import { env } from "../../config/env";
import type { SelectionSetNode } from "graphql";

/**
 * Limit query depth to prevent deeply nested queries
 * Max depth: 5 levels
 */
export function createDepthLimitPlugin(maxDepth: number = 5): Plugin {
  return {
    onExecute: ({ args }) => {
      const { document } = args;

      const calculateDepth = (
        selectionSet: SelectionSetNode,
        currentDepth: number = 1
      ): number => {
        if (!selectionSet || !selectionSet.selections) return currentDepth;

        let maxChildDepth = currentDepth;

        for (const selection of selectionSet.selections) {
          if (selection.kind === "Field") {
            // Skip introspection fields
            if (selection.name.value.startsWith("__")) {
              continue;
            }

            if (selection.selectionSet) {
              const childDepth = calculateDepth(
                selection.selectionSet,
                currentDepth + 1
              );
              maxChildDepth = Math.max(maxChildDepth, childDepth);
            }
          } else if (selection.kind === "InlineFragment") {
            if (selection.selectionSet) {
              const childDepth = calculateDepth(
                selection.selectionSet,
                currentDepth
              );
              maxChildDepth = Math.max(maxChildDepth, childDepth);
            }
          }
          // XMDEV-545: Handle FragmentSpread
          // FragmentSpread doesn't have a selectionSet - it references a fragment definition
          // Fragment definitions are handled separately when encountered
        }

        return maxChildDepth;
      };

      for (const definition of document.definitions) {
        if (definition.kind === "OperationDefinition") {
          const depth = calculateDepth(definition.selectionSet);

          if (depth > maxDepth) {
            throw new Error(
              `Query depth (${depth}) exceeds maximum allowed depth (${maxDepth}). ` +
                `Please reduce nesting in your query.`
            );
          }

          if (env.LOG_LEVEL === "debug") {
            console.log(`[GraphQL] Query depth: ${depth}`);
          }
        }
      }

      return undefined; // Continue execution
    },
  };
}
