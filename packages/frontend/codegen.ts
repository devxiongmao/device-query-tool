import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
  documents: ["src/**/*.{graphql,gql}", "src/**/*.{ts,tsx}"],

  generates: {
    "./src/graphql/generated/graphql.ts": {
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
        skipTypename: false,
        enumsAsConst: true,
        useTypeImports: true,
      },
    },
  },

  watch: false,
  ignoreNoDocuments: true,
  verbose: true,
};

export default config;
