import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import type { GraphQLContext } from "../context";

// Create the schema builder with proper typing
export const builder = new SchemaBuilder<{
  Context: GraphQLContext;
  Scalars: {
    ID: {
      Output: string | number;
      Input: string | number;
    };
    DateTime: {
      Output: Date | string;
      Input: Date | string;
    };
  };
}>({
  plugins: [RelayPlugin],
  relay: {
    clientMutationId: "omit",
    cursorType: "String",
  },
});

// Define custom scalar types
builder.scalarType("DateTime", {
  serialize: (value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value as string;
  },
  parseValue: (value) => {
    if (typeof value === "string") {
      return new Date(value);
    }
    return value as Date;
  },
});

// Query root type
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "Hello from GraphQL!",
    }),

    // Test database connection
    deviceCount: t.int({
      resolve: async (_root, _args, ctx) => {
        const result = await ctx.db.execute(
          'SELECT COUNT(*) as count FROM "DEVICE"'
        );
        return Number(result[0].count);
      },
    }),
  }),
});

// Mutation root type (for future use)
builder.mutationType({
  fields: (t) => ({
    // Placeholder - we'll add mutations later
    _placeholder: t.string({
      resolve: () => "Mutations will be added here",
    }),
  }),
});
