import SchemaBuilder from "@pothos/core";
import RelayPlugin from "@pothos/plugin-relay";
import type { GraphQLContext } from "../context";

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

// Query root type (fields will be added in queries/)
builder.queryType({
  fields: (t) => ({
    hello: t.string({
      resolve: () => "Hello from GraphQL!",
    }),
  }),
});

// Mutation root type
builder.mutationType({
  fields: (t) => ({
    _placeholder: t.string({
      resolve: () => "Mutations will be added here",
    }),
  }),
});
