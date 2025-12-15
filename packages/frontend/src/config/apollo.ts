import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        extensions
      );

      // Handle specific error codes
      if (extensions?.code === "RATE_LIMIT_EXCEEDED") {
        const resetIn = extensions.resetIn as any;
        console.warn(`Rate limited. Retry in ${resetIn} seconds.`);
        // Could show a toast notification here
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// HTTP link to backend
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:3000/graphql",
  credentials: "same-origin",
});

// Create Apollo Client
export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          // Cache policies for specific fields
          devices: {
            // Merge incoming data with existing cache
            keyArgs: ["vendor", "modelNum", "marketName"],
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
      Device: {
        keyFields: ["id"],
      },
      Software: {
        keyFields: ["id"],
      },
      Band: {
        keyFields: ["id"],
      },
      Combo: {
        keyFields: ["id"],
      },
      Feature: {
        keyFields: ["id"],
      },
      Provider: {
        keyFields: ["id"],
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "cache-first",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
