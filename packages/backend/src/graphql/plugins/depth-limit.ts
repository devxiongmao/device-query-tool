import type { Plugin } from "graphql-yoga";
import { env } from "../../config/env";
import type { FragmentDefinitionNode, SelectionSetNode } from "graphql";

/**
 * Limit query depth to prevent deeply nested queries
 * Max depth: 5 levels
 */
export function createDepthLimitPlugin(maxDepth: number = 5): Plugin {
  return {
    onExecute: ({ args }) => {
      const { document } = args;

      // Build a map of fragment definitions for quick lookup
      const fragmentMap = new Map<string, FragmentDefinitionNode>();
      for (const definition of document.definitions) {
        if (definition.kind === "FragmentDefinition") {
          fragmentMap.set(definition.name.value, definition);
        }
      }

      // Track visited fragments to prevent infinite loops from circular references
      const visitedFragments = new Set<string>();

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
          } else if (selection.kind === "FragmentSpread") {
            // Handle FragmentSpread: look up the fragment definition and calculate its depth
            const fragmentName = selection.name.value;

            // Prevent infinite loops from circular fragment references
            if (visitedFragments.has(fragmentName)) {
              continue;
            }

            const fragmentDef = fragmentMap.get(fragmentName);
            if (fragmentDef && fragmentDef.selectionSet) {
              visitedFragments.add(fragmentName);
              const childDepth = calculateDepth(
                fragmentDef.selectionSet,
                currentDepth
              );
              visitedFragments.delete(fragmentName);
              maxChildDepth = Math.max(maxChildDepth, childDepth);
            }
          }
        }

        return maxChildDepth;
      };

      for (const definition of document.definitions) {
        if (definition.kind === "OperationDefinition") {
          // Reset visited fragments for each operation
          visitedFragments.clear();
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
