import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // Point to your GraphQL schema
  schema: "http://localhost:3000/graphql",

  // Where to find GraphQL operations (queries, mutations, fragments)
  documents: ["src/**/*.{graphql,gql}", "src/**/*.{ts,tsx}"],

  // What to generate
  generates: {
    // Generate TypeScript types and React hooks
    "./src/graphql/generated/": {
      preset: "client",
      plugins: [],
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false, // Disable fragment masking for easier access
      },
      config: {
        // Use our custom scalars
        scalars: {
          DateTime: "string",
        },
        // Skip typename in results
        skipTypename: false,
        // Enum as const
        enumsAsConst: true,
      },
    },

    // Generate schema types separately (useful for reference)
    "./src/graphql/generated/schema.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        scalars: {
          DateTime: "string",
        },
        enumsAsConst: true,
        avoidOptionals: false,
        maybeValue: "T | null",
      },
    },

    // Generate React Apollo hooks
    "./src/graphql/generated/hooks.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        scalars: {
          DateTime: "string",
        },
        withHooks: true,
        withHOC: false,
        withComponent: false,
        apolloReactHooksImportFrom: "@apollo/client",
      },
    },
  },

  // Generate on file changes
  watch: false,

  // Ignore files
  ignoreNoDocuments: true,

  // Verbose output
  verbose: true,
};

export default config;
