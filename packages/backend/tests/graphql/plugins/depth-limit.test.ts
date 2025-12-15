import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parse } from "graphql";
import { createDepthLimitPlugin } from "../../../src/graphql/plugins/depth-limit";

// Mock env config
vi.mock("../../../src/config/env", () => ({
  env: {
    LOG_LEVEL: "error", // Default to error to avoid console spam
  },
}));

describe("createDepthLimitPlugin", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  // Helper to create mock execution args
  const createExecutionArgs = (query: string) => {
    return {
      args: {
        document: parse(query),
        schema: {} as any,
        contextValue: {
          params: {},
          request: new Request("http://localhost"),
          waitUntil: vi.fn(),
        } as any,
        rootValue: {},
        variableValues: {},
        operationName: undefined,
      },
      executeFn: vi.fn(),
      setExecuteFn: vi.fn(),
      setResultAndStopExecution: vi.fn(),
      context: {
        params: {},
        request: new Request("http://localhost"),
        waitUntil: vi.fn(),
      } as any,
      extendContext: vi.fn(),
    };
  };

  describe("Basic functionality", () => {
    it("should allow queries within depth limit", () => {
      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          user {
            id
            name
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should throw error when depth exceeds limit", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        query {
          user {
            profile {
              settings {
                preferences {
                  theme
                }
              }
            }
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow(/Query depth.*exceeds maximum allowed depth/);
    });

    it("should include depth values in error message", () => {
      const plugin = createDepthLimitPlugin(2);
      const query = `
        query {
          user {
            profile {
              bio
            }
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow(/Query depth \(3\) exceeds maximum allowed depth \(2\)/);
    });
  });

  describe("Depth calculation", () => {
    it("should calculate depth 1 for root level fields", () => {
      const plugin = createDepthLimitPlugin(1);
      const query = `
        query {
          user
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should calculate depth 2 for one level of nesting", () => {
      const plugin = createDepthLimitPlugin(2);
      const query = `
        query {
          user {
            id
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should calculate depth 3 for two levels of nesting", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        query {
          user {
            profile {
              bio
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should calculate depth correctly for deeply nested queries", () => {
      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          user {
            profile {
              settings {
                preferences {
                  theme
                }
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should fail at exactly maxDepth + 1", () => {
      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          level1 {
            level2 {
              level3 {
                level4 {
                  level5 {
                    level6
                  }
                }
              }
            }
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow();
    });
  });

  describe("Multiple fields and branches", () => {
    it("should use maximum depth from all branches", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        query {
          user {
            id
          }
          settings {
            theme {
              color
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should fail if any branch exceeds depth", () => {
      const plugin = createDepthLimitPlugin(2);
      const query = `
        query {
          user {
            id
          }
          settings {
            theme {
              color
            }
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow();
    });

    it("should handle sibling fields at same depth", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        query {
          user {
            id
            name
            email
            profile {
              bio
              avatar
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should calculate depth correctly with multiple root fields", () => {
      const plugin = createDepthLimitPlugin(4);
      const query = `
        query {
          user {
            profile {
              settings {
                theme
              }
            }
          }
          devices {
            software {
              version
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });
  });

  describe("Introspection fields", () => {
    it("should skip __typename fields", () => {
      const plugin = createDepthLimitPlugin(2);
      const query = `
        query {
          user {
            __typename
            id
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should skip __schema queries", () => {
      const plugin = createDepthLimitPlugin(1);
      const query = `
        query {
          __schema {
            types {
              name
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should skip __type queries", () => {
      const plugin = createDepthLimitPlugin(1);
      const query = `
        query {
          __type(name: "User") {
            name
            fields {
              name
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should count non-introspection fields normally even with introspection fields present", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        query {
          user {
            __typename
            profile {
              __typename
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });
  });

  describe("Fragments", () => {
    it("should handle inline fragments without increasing depth", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        query {
          user {
            ... on User {
              profile {
                bio
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should calculate depth correctly with multiple inline fragments", () => {
      const plugin = createDepthLimitPlugin(4);
      const query = `
        query {
          search {
            ... on User {
              profile {
                settings {
                  theme
                }
              }
            }
            ... on Device {
              software {
                version
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle named fragments", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        fragment UserFields on User {
          id
          name
        }
        
        query {
          user {
            ...UserFields
            profile {
              bio
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle nested inline fragments", () => {
      const plugin = createDepthLimitPlugin(4);
      const query = `
        query {
          search {
            ... on User {
              ... on VerifiedUser {
                profile {
                  settings {
                    theme
                  }
                }
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });
  });

  describe("Configuration", () => {
    it("should use default max depth of 5", () => {
      const plugin = createDepthLimitPlugin();
      const query = `
        query {
          level1 {
            level2 {
              level3 {
                level4 {
                  level5
                }
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should respect custom max depth", () => {
      const plugin = createDepthLimitPlugin(7);
      const query = `
        query {
          level1 {
            level2 {
              level3 {
                level4 {
                  level5 {
                    level6 {
                      level7
                    }
                  }
                }
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should allow very restrictive depth limits", () => {
      const plugin = createDepthLimitPlugin(1);
      const query = `
        query {
          user
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });
  });

  describe("Logging", () => {
    it("should log depth when LOG_LEVEL is debug", async () => {
      const { env } = await import("../../../src/config/env");
      env.LOG_LEVEL = "debug";

      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          user {
            id
          }
        }
      `;

      plugin.onExecute?.(createExecutionArgs(query));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[GraphQL\] Query depth: \d+/)
      );

      env.LOG_LEVEL = "error";
    });

    it("should not log when LOG_LEVEL is not debug", () => {
      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          user {
            id
          }
        }
      `;

      plugin.onExecute?.(createExecutionArgs(query));

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("should not log when LOG_LEVEL is info", async () => {
      const { env } = await import("../../../src/config/env");
      env.LOG_LEVEL = "info";

      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          user {
            id
          }
        }
      `;

      plugin.onExecute?.(createExecutionArgs(query));

      expect(consoleSpy).not.toHaveBeenCalled();

      env.LOG_LEVEL = "error";
    });
  });

  describe("Edge cases", () => {
    it("should handle queries with only introspection fields", () => {
      const plugin = createDepthLimitPlugin(1);
      const query = `
        query {
          __typename
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle queries with aliases", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        query {
          currentUser: user {
            userProfile: profile {
              bio
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle mutations", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        mutation {
          createUser(input: { name: "test" }) {
            user {
              id
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle empty selection sets", () => {
      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          timestamp
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should return undefined to continue execution", () => {
      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          user {
            id
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle multiple operation definitions", () => {
      const plugin = createDepthLimitPlugin(3);
      const query = `
        query GetUser {
          user {
            profile {
              bio
            }
          }
        }
        
        query GetDevice {
          device {
            software {
              version
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });
  });

  describe("Real-world scenarios", () => {
    it("should handle typical nested resource queries", () => {
      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          user {
            devices {
              software {
                features {
                  description
                }
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should reject excessively deep queries", () => {
      const plugin = createDepthLimitPlugin(5);
      const query = `
        query {
          user {
            profile {
              settings {
                preferences {
                  theme {
                    colors {
                      primary
                    }
                  }
                }
              }
            }
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow(/Query depth.*exceeds maximum allowed depth/);
    });

    it("should handle complex queries with multiple deep branches", () => {
      const plugin = createDepthLimitPlugin(4);
      const query = `
        query {
          user {
            profile {
              settings {
                theme
              }
            }
            devices {
              software {
                version
              }
            }
            friends {
              profile {
                bio
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle GraphQL introspection queries without restrictions", () => {
      const plugin = createDepthLimitPlugin(1);
      const query = `
        query IntrospectionQuery {
          __schema {
            queryType {
              name
            }
            mutationType {
              name
            }
            types {
              name
              kind
              fields {
                name
                type {
                  name
                }
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });
  });
});
