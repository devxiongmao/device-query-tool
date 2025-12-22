import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { parse } from "graphql";
import { createComplexityPlugin } from "../../../src/graphql/plugins/complexity";

// Mock env config
vi.mock("../../../src/config/env", () => ({
  env: {
    LOG_LEVEL: "error", // Default to error to avoid console spam
  },
}));

describe("createComplexityPlugin", () => {
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
    it("should allow simple queries under complexity limit", () => {
      const plugin = createComplexityPlugin(100);
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

    it("should throw error when complexity exceeds limit", () => {
      const plugin = createComplexityPlugin(5);
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

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow(/Query is too complex/);
    });

    it("should include complexity values in error message", () => {
      const plugin = createComplexityPlugin(5);
      const query = `
        query {
          devices {
            id
            name
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow(/\((\d+) > 5\)/);
    });
  });

  describe("Field complexity calculation", () => {
    it("should calculate simple field cost as 1 point", () => {
      const plugin = createComplexityPlugin(10);
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

    it("should calculate list field cost as 10 points", () => {
      const plugin = createComplexityPlugin(20);
      const query = `
        query {
          devices {
            id
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should throw when list field exceeds limit", () => {
      const plugin = createComplexityPlugin(5);
      const query = `
        query {
          devices {
            id
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow();
    });
  });

  describe("List field detection", () => {
    const listFields = [
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
    ];

    listFields.forEach((field) => {
      it(`should recognize '${field}' as a list field`, () => {
        const plugin = createComplexityPlugin(5);
        const query = `
          query {
            ${field} {
              id
            }
          }
        `;

        expect(() => {
          plugin.onExecute?.(createExecutionArgs(query));
        }).toThrow(/Query is too complex/);
      });
    });

    it("should not treat non-list fields as expensive", () => {
      const plugin = createComplexityPlugin(10);
      const query = `
        query {
          user {
            id
            name
            email
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });
  });

  describe("Depth multiplier", () => {
    it("should multiply cost by depth level", () => {
      const plugin = createComplexityPlugin(50);
      const query = `
        query {
          user {
            profile {
              settings {
                theme
              }
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should apply depth multiplier to list fields", () => {
      const plugin = createComplexityPlugin(100);
      const query = `
        query {
          user {
            devices {
              id
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should fail on deeply nested list fields", () => {
      const plugin = createComplexityPlugin(50);
      const query = `
        query {
          user {
            devices {
              software {
                id
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

  describe("Multiple fields and selections", () => {
    it("should sum complexity across multiple root fields", () => {
      const plugin = createComplexityPlugin(5);
      const query = `
        query {
          user {
            id
          }
          settings {
            theme
          }
          profile {
            bio
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow();
    });

    it("should handle multiple list fields", () => {
      const plugin = createComplexityPlugin(15);
      const query = `
        query {
          devices {
            id
          }
          software {
            name
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow();
    });

    it("should calculate complexity for sibling fields at same depth", () => {
      const plugin = createComplexityPlugin(100);
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
  });

  describe("Configuration", () => {
    it("should use default max complexity of 1000", () => {
      const plugin = createComplexityPlugin();
      const query = `
        query {
          devices {
            id
            name
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should respect custom max complexity", () => {
      const plugin = createComplexityPlugin(20);
      const query = `
        query {
          devices {
            id
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });
  });

  describe("Logging", () => {
    it("should log complexity when LOG_LEVEL is info", async () => {
      const { env } = await import("../../../src/config/env");
      env.LOG_LEVEL = "info";

      const plugin = createComplexityPlugin(100);
      const query = `
        query {
          user {
            id
          }
        }
      `;

      plugin.onExecute?.(createExecutionArgs(query));

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[GraphQL\] Query complexity: \d+/)
      );

      env.LOG_LEVEL = "error";
    });

    it("should not log when LOG_LEVEL is not info", () => {
      const plugin = createComplexityPlugin(100);
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
  });

  describe("Edge cases", () => {
    it("should handle empty selection sets", () => {
      const plugin = createComplexityPlugin(100);
      const query = `
        query {
          __typename
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle queries with aliases", () => {
      const plugin = createComplexityPlugin(100);
      const query = `
        query {
          myDevices: devices {
            id
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle fragments", () => {
      const plugin = createComplexityPlugin(100);
      const query = `
        fragment DeviceFields on Device {
          id
          name
        }
        
        query {
          devices {
            ...DeviceFields
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should handle mutations", () => {
      const plugin = createComplexityPlugin(100);
      const query = `
        mutation {
          createDevice(input: { name: "test" }) {
            id
            name
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should return undefined to continue execution", () => {
      const plugin = createComplexityPlugin(100);
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
  });

  describe("Complex real-world scenarios", () => {
    it("should handle typical device query", () => {
      const plugin = createComplexityPlugin(200);
      const query = `
        query {
          devices {
            id
            name
            software {
              version
            }
            supportedBands {
              name
              frequency
            }
          }
        }
      `;

      const result = plugin.onExecute?.(createExecutionArgs(query));
      expect(result).toBeUndefined();
    });

    it("should reject overly complex nested list queries", () => {
      const plugin = createComplexityPlugin(100);
      const query = `
        query {
          devices {
            id
            name
            supportedBands {
              name
              bandComponents {
                type
                features {
                  description
                }
              }
            }
          }
        }
      `;

      expect(() => {
        plugin.onExecute?.(createExecutionArgs(query));
      }).toThrow(/Query is too complex/);
    });
  });
});
