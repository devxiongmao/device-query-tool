import type { Plugin } from "graphql-yoga";
import type { SelectionSetNode } from "graphql";
import { env } from "../../config/env";

/**
 * Calculate query complexity to prevent expensive queries
 *
 * Complexity rules:
 * - Each field: 1 point
 * - Each list field: 10 points
 * - Each nested level: multiply by depth
 */
export function createComplexityPlugin(maxComplexity: number = 1000): Plugin {
  return {
    onExecute: ({ args }) => {
      let complexity = 0;

      const calculateComplexity = (
        selectionSet: SelectionSetNode | null,
        depth: number = 1
      ): number => {
        if (!selectionSet || !selectionSet.selections) return 0;

        let total = 0;

        for (const selection of selectionSet.selections) {
          if (selection.kind === "Field") {
            const fieldName = selection.name.value;

            // Lists are more expensive
            const isListField = [
              "devices",
              "software",
              "bands",
              "combos",
              "features",
              "supportedBands",
              "supportedCombos",
              "deviceSupport",
              "bandComponents",
              "availability",
            ].includes(fieldName);

            // Base cost
            const baseCost = isListField ? 10 : 1;

            // Add cost with depth multiplier
            total += baseCost * depth;

            // Recursively calculate nested fields
            if (selection.selectionSet) {
              total += calculateComplexity(selection.selectionSet, depth + 1);
            }
          }
        }

        return total;
      };

      // Calculate complexity for the query
      const document = args.document;
      for (const definition of document.definitions) {
        if (definition.kind === "OperationDefinition") {
          complexity += calculateComplexity(definition.selectionSet);
        }
      }

      if (complexity > maxComplexity) {
        throw new Error(
          `Query is too complex (${complexity} > ${maxComplexity}). ` +
            `Please simplify your query or split it into multiple requests.`
        );
      }

      if (env.LOG_LEVEL === "info") {
        console.log(`[GraphQL] Query complexity: ${complexity}`);
      }

      return undefined; // Continue execution
    },
  };
}
