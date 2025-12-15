import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { createRateLimiterPlugin } from "../../../src/graphql/plugins/rate-limiter";

// Mock env config
vi.mock("../../../src/config/env", () => ({
  env: {
    LOG_LEVEL: "error",
    NODE_ENV: "production", // Default to production for rate limiting tests
  },
}));

describe("createRateLimiterPlugin", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  let dateNowSpy: ReturnType<typeof vi.spyOn>;
  let currentTime: number;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    currentTime = Date.now();
    dateNowSpy = vi.spyOn(Date, "now").mockImplementation(() => currentTime);
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    dateNowSpy.mockRestore();
  });

  // Helper to advance time
  const advanceTime = (ms: number) => {
    currentTime += ms;
  };

  // Helper to create mock request context
  const createRequestContext = (ip: string = "192.168.1.1") => {
    const endResponse = vi.fn();
    const request = new Request("http://localhost/graphql", {
      headers: {
        "x-forwarded-for": ip,
      },
    });

    return {
      request,
      fetchAPI: {
        Response,
      },
      endResponse,
      url: new URL("http://localhost/graphql"),
      requestParser: vi.fn(),
      serverContext: {
        waitUntil: vi.fn(),
      },
      setRequest: vi.fn(),
      requestHandler: vi.fn(),
      setRequestHandler: vi.fn(),
    } as any;
  };

  describe("Basic functionality", () => {
    it("should allow requests under rate limit", () => {
      const plugin = createRateLimiterPlugin(100, 1000);
      const context = createRequestContext();

      const result = plugin.onRequest?.(context);
      expect(result).toBeUndefined();
      expect(context.endResponse).not.toHaveBeenCalled();
    });

    it("should track requests per IP", () => {
      const plugin = createRateLimiterPlugin(100, 1000);
      const context1 = createRequestContext("192.168.1.1");
      const context2 = createRequestContext("192.168.1.1");

      plugin.onRequest?.(context1);
      plugin.onRequest?.(context2);

      expect(context1.endResponse).not.toHaveBeenCalled();
      expect(context2.endResponse).not.toHaveBeenCalled();
    });

    it("should isolate rate limits between different IPs", () => {
      const plugin = createRateLimiterPlugin(2, 10);
      const context1 = createRequestContext("192.168.1.1");
      const context2 = createRequestContext("192.168.1.2");

      // IP 1 makes 2 requests
      plugin.onRequest?.(context1);
      plugin.onRequest?.(context1);

      // IP 2 should still be allowed
      plugin.onRequest?.(context2);
      expect(context2.endResponse).not.toHaveBeenCalled();
    });
  });

  describe("Minute rate limiting", () => {
    it("should block requests exceeding per-minute limit", () => {
      const plugin = createRateLimiterPlugin(2, 1000);
      const context = createRequestContext();

      // First 2 requests should pass
      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // Third request should be blocked
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      expect(blockedContext.endResponse).toHaveBeenCalled();
      const response = blockedContext.endResponse.mock.calls[0][0];
      expect(response.status).toBe(429);
    });

    it("should include error message in rate limit response", async () => {
      const plugin = createRateLimiterPlugin(1, 1000);
      const context = createRequestContext();

      plugin.onRequest?.(context);

      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      const response = blockedContext.endResponse.mock.calls[0][0];
      const body = await response.json();

      expect(body.errors).toHaveLength(1);
      expect(body.errors[0].message).toMatch(/Rate limit exceeded/);
      expect(body.errors[0].extensions.code).toBe("RATE_LIMIT_EXCEEDED");
    });

    it("should include resetIn time in response", async () => {
      const plugin = createRateLimiterPlugin(1, 1000);
      const context = createRequestContext();

      plugin.onRequest?.(context);

      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      const response = blockedContext.endResponse.mock.calls[0][0];
      const body = await response.json();

      expect(body.errors[0].extensions.resetIn).toBeGreaterThan(0);
      expect(body.errors[0].extensions.resetIn).toBeLessThanOrEqual(60);
    });

    it("should include Retry-After header", () => {
      const plugin = createRateLimiterPlugin(1, 1000);
      const context = createRequestContext();

      plugin.onRequest?.(context);

      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      const response = blockedContext.endResponse.mock.calls[0][0];
      expect(response.headers.get("Retry-After")).toBeTruthy();
    });

    it("should reset minute counter after 60 seconds", () => {
      const plugin = createRateLimiterPlugin(2, 1000);
      const context = createRequestContext();

      // Use up the limit
      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // Should be blocked
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);
      expect(blockedContext.endResponse).toHaveBeenCalled();

      // Advance time by 61 seconds
      advanceTime(61 * 1000);

      // Should be allowed again
      const allowedContext = createRequestContext();
      plugin.onRequest?.(allowedContext);
      expect(allowedContext.endResponse).not.toHaveBeenCalled();
    });

    it("should calculate correct resetIn time", async () => {
      const plugin = createRateLimiterPlugin(1, 1000);
      const context = createRequestContext();

      plugin.onRequest?.(context);

      // Advance 30 seconds
      advanceTime(30 * 1000);

      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      const response = blockedContext.endResponse.mock.calls[0][0];
      const body = await response.json();

      // Should have ~30 seconds remaining
      expect(body.errors[0].extensions.resetIn).toBeGreaterThan(25);
      expect(body.errors[0].extensions.resetIn).toBeLessThanOrEqual(30);
    });
  });

  describe("Hour rate limiting", () => {
    it("should block requests exceeding per-hour limit", () => {
      const plugin = createRateLimiterPlugin(100, 2);
      const context = createRequestContext();

      // First 2 requests should pass
      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // Third request should be blocked
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      expect(blockedContext.endResponse).toHaveBeenCalled();
      const response = blockedContext.endResponse.mock.calls[0][0];
      expect(response.status).toBe(429);
    });

    it("should include hourly message in rate limit response", async () => {
      const plugin = createRateLimiterPlugin(100, 1);
      const context = createRequestContext();

      plugin.onRequest?.(context);

      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      const response = blockedContext.endResponse.mock.calls[0][0];
      const body = await response.json();

      expect(body.errors[0].message).toMatch(/Hourly rate limit exceeded/);
      expect(body.errors[0].message).toMatch(/minutes/);
    });

    it("should reset hour counter after 3600 seconds", () => {
      const plugin = createRateLimiterPlugin(100, 2);
      const context = createRequestContext();

      // Use up the limit
      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // Should be blocked
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);
      expect(blockedContext.endResponse).toHaveBeenCalled();

      // Advance time by 1 hour + 1 second
      advanceTime(3601 * 1000);

      // Should be allowed again
      const allowedContext = createRequestContext();
      plugin.onRequest?.(allowedContext);
      expect(allowedContext.endResponse).not.toHaveBeenCalled();
    });

    it("should prioritize minute limit over hour limit", async () => {
      const plugin = createRateLimiterPlugin(1, 1);
      const context = createRequestContext();

      plugin.onRequest?.(context);

      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      const response = blockedContext.endResponse.mock.calls[0][0];
      const body = await response.json();

      // Should get minute limit message, not hour limit message
      expect(body.errors[0].message).toMatch(/Rate limit exceeded/);
      expect(body.errors[0].message).not.toMatch(/Hourly/);
      expect(body.errors[0].message).toMatch(/seconds/);
    });
  });

  describe("IP extraction", () => {
    it("should extract IP from x-forwarded-for header", () => {
      const plugin = createRateLimiterPlugin(2, 10);
      const context = createRequestContext("10.0.0.1");

      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      const blockedContext = createRequestContext("10.0.0.1");
      plugin.onRequest?.(blockedContext);

      expect(blockedContext.endResponse).toHaveBeenCalled();
    });

    it("should handle multiple IPs in x-forwarded-for (use first)", () => {
      const plugin = createRateLimiterPlugin(2, 10);
      const context = createRequestContext("192.168.1.1, 10.0.0.1, 172.16.0.1");

      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // Same first IP should be rate limited
      const blockedContext = createRequestContext("192.168.1.1, 10.0.0.2");
      plugin.onRequest?.(blockedContext);

      expect(blockedContext.endResponse).toHaveBeenCalled();
    });

    it("should trim whitespace from forwarded IP", () => {
      const plugin = createRateLimiterPlugin(2, 10);
      const context1 = createRequestContext(" 192.168.1.1 ");
      const context2 = createRequestContext("192.168.1.1");

      plugin.onRequest?.(context1);
      plugin.onRequest?.(context2);

      const blockedContext = createRequestContext("192.168.1.1");
      plugin.onRequest?.(blockedContext);

      expect(blockedContext.endResponse).toHaveBeenCalled();
    });

    it("should handle missing x-forwarded-for header", () => {
      const plugin = createRateLimiterPlugin(2, 10);
      const request = new Request("http://localhost/graphql");
      const endResponse = vi.fn();

      const context = {
        request,
        fetchAPI: { Response },
        endResponse,
        url: new URL("http://localhost/graphql"),
        requestParser: vi.fn(),
        serverContext: {
          waitUntil: vi.fn(),
        },
        setRequest: vi.fn(),
        requestHandler: vi.fn(),
        setRequestHandler: vi.fn(),
      } as any;

      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      const blockedContext = {
        request: new Request("http://localhost/graphql"),
        fetchAPI: { Response },
        endResponse: vi.fn(),
        url: new URL("http://localhost/graphql"),
        requestParser: vi.fn(),
        serverContext: {
          waitUntil: vi.fn(),
        },
        setRequest: vi.fn(),
        requestHandler: vi.fn(),
        setRequestHandler: vi.fn(),
      } as any;

      plugin.onRequest?.(blockedContext);

      expect(blockedContext.endResponse).toHaveBeenCalled();
    });
  });

  describe("Configuration", () => {
    it("should use default limits of 100/minute and 1000/hour", () => {
      const plugin = createRateLimiterPlugin();
      const context = createRequestContext();

      // Make 100 requests
      for (let i = 0; i < 100; i++) {
        plugin.onRequest?.(context);
      }

      expect(context.endResponse).not.toHaveBeenCalled();

      // 101st should be blocked
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);
      expect(blockedContext.endResponse).toHaveBeenCalled();
    });

    it("should respect custom per-minute limit", () => {
      const plugin = createRateLimiterPlugin(5, 1000);
      const context = createRequestContext();

      // Make 5 requests
      for (let i = 0; i < 5; i++) {
        plugin.onRequest?.(context);
      }

      expect(context.endResponse).not.toHaveBeenCalled();

      // 6th should be blocked
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);
      expect(blockedContext.endResponse).toHaveBeenCalled();
    });

    it("should respect custom per-hour limit", () => {
      const plugin = createRateLimiterPlugin(1000, 10);
      const context = createRequestContext();

      // Make 10 requests
      for (let i = 0; i < 10; i++) {
        plugin.onRequest?.(context);
      }

      expect(context.endResponse).not.toHaveBeenCalled();

      // 11th should be blocked
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);
      expect(blockedContext.endResponse).toHaveBeenCalled();
    });
  });

  describe("Development environment", () => {
    it("should skip rate limiting in development", async () => {
      const { env } = await import("../../../src/config/env");
      env.NODE_ENV = "development";

      const plugin = createRateLimiterPlugin(1, 1);
      const context = createRequestContext();

      // Make many requests - should all pass
      for (let i = 0; i < 10; i++) {
        plugin.onRequest?.(context);
      }

      expect(context.endResponse).not.toHaveBeenCalled();

      env.NODE_ENV = "production";
    });

    it("should enforce rate limiting in production", async () => {
      const { env } = await import("../../../src/config/env");
      env.NODE_ENV = "production";

      const plugin = createRateLimiterPlugin(2, 10);
      const context = createRequestContext();

      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      expect(blockedContext.endResponse).toHaveBeenCalled();
    });
  });

  describe("Logging", () => {
    it("should log rate limit stats when LOG_LEVEL is debug", async () => {
      const { env } = await import("../../../src/config/env");
      env.LOG_LEVEL = "debug";

      const plugin = createRateLimiterPlugin(100, 1000);
      const context = createRequestContext("192.168.1.1");

      plugin.onRequest?.(context);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /\[Rate Limit\] 192\.168\.1\.1: \d+\/100 per minute, \d+\/1000 per hour/
        )
      );

      env.LOG_LEVEL = "error";
    });

    it("should not log when LOG_LEVEL is not debug", () => {
      const plugin = createRateLimiterPlugin(100, 1000);
      const context = createRequestContext();

      plugin.onRequest?.(context);

      expect(consoleSpy).not.toHaveBeenCalled();
    });
  });

  describe("Memory cleanup", () => {
    it("should cleanup expired minute entries", () => {
      const plugin = createRateLimiterPlugin(2, 10);
      const context = createRequestContext();

      // Make requests
      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // Advance past cleanup interval (5 minutes) and expiry time
      advanceTime(6 * 60 * 1000);

      // New request should work (store was cleaned up)
      const newContext = createRequestContext();
      plugin.onRequest?.(newContext);
      expect(newContext.endResponse).not.toHaveBeenCalled();
    });

    it("should cleanup expired hour entries", () => {
      const plugin = createRateLimiterPlugin(100, 2);
      const context = createRequestContext();

      // Make requests
      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // Advance past 1 hour (3600000ms) to expire the hour window
      advanceTime(3601 * 1000);

      // New request should work (store was cleaned up)
      const newContext = createRequestContext();
      plugin.onRequest?.(newContext);
      expect(newContext.endResponse).not.toHaveBeenCalled();
    });

    it("should not cleanup non-expired entries", () => {
      const plugin = createRateLimiterPlugin(2, 10);
      const context = createRequestContext();

      // Make requests
      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // Advance less than 60 seconds so minute window hasn't expired
      advanceTime(30 * 1000);

      // Should still be rate limited (not cleaned up)
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);
      expect(blockedContext.endResponse).toHaveBeenCalled();
    });
  });

  describe("Edge cases", () => {
    it("should handle exactly at limit", () => {
      const plugin = createRateLimiterPlugin(3, 10);
      const context = createRequestContext();

      // Make exactly 3 requests
      plugin.onRequest?.(context);
      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // All should succeed
      expect(context.endResponse).not.toHaveBeenCalled();

      // 4th should fail
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);
      expect(blockedContext.endResponse).toHaveBeenCalled();
    });

    it("should handle concurrent requests from same IP", () => {
      const plugin = createRateLimiterPlugin(2, 10);
      const context1 = createRequestContext();
      const context2 = createRequestContext();
      const context3 = createRequestContext();

      // Simulate concurrent requests
      plugin.onRequest?.(context1);
      plugin.onRequest?.(context2);
      plugin.onRequest?.(context3);

      // Third should be blocked
      expect(context3.endResponse).toHaveBeenCalled();
    });

    it("should handle requests at limit boundary during reset", () => {
      const plugin = createRateLimiterPlugin(2, 10);
      const context = createRequestContext();

      plugin.onRequest?.(context);
      plugin.onRequest?.(context);

      // Advance past reset time (need > 60 seconds since resetTime < now check is strict)
      advanceTime(60 * 1000 + 1);

      const allowedContext = createRequestContext();
      plugin.onRequest?.(allowedContext);
      expect(allowedContext.endResponse).not.toHaveBeenCalled();
    });

    it("should return undefined when not blocking", () => {
      const plugin = createRateLimiterPlugin(100, 1000);
      const context = createRequestContext();

      const result = plugin.onRequest?.(context);
      expect(result).toBeUndefined();
    });

    it("should handle very high request volumes", () => {
      const plugin = createRateLimiterPlugin(1000, 10000);
      const context = createRequestContext();

      // Make 1000 requests
      for (let i = 0; i < 1000; i++) {
        plugin.onRequest?.(context);
      }

      expect(context.endResponse).not.toHaveBeenCalled();

      // 1001st should be blocked
      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);
      expect(blockedContext.endResponse).toHaveBeenCalled();
    });
  });

  describe("Response format", () => {
    it("should return proper GraphQL error format", async () => {
      const plugin = createRateLimiterPlugin(1, 10);
      const context = createRequestContext();

      plugin.onRequest?.(context);

      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      const response = blockedContext.endResponse.mock.calls[0][0];
      const body = await response.json();

      expect(body).toHaveProperty("errors");
      expect(Array.isArray(body.errors)).toBe(true);
      expect(body.errors[0]).toHaveProperty("message");
      expect(body.errors[0]).toHaveProperty("extensions");
    });

    it("should include proper content-type header", () => {
      const plugin = createRateLimiterPlugin(1, 10);
      const context = createRequestContext();

      plugin.onRequest?.(context);

      const blockedContext = createRequestContext();
      plugin.onRequest?.(blockedContext);

      const response = blockedContext.endResponse.mock.calls[0][0];
      expect(response.headers.get("Content-Type")).toBe("application/json");
    });
  });
});
