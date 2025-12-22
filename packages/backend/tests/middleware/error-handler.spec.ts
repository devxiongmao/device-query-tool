import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Hono } from "hono";
import { errorHandler } from "../../src/middleware/error-handler";
import { resetEnvCache } from "../../src/config/env";

type ErrorResponse = {
  error: {
    message: string;
    stack?: string;
  };
};

describe("errorHandler middleware", () => {
  let app: Hono;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  let originalNodeEnv: string;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    app = new Hono();
    app.onError(errorHandler);
    originalNodeEnv = process.env.NODE_ENV!;
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    process.env.NODE_ENV = originalNodeEnv;
    resetEnvCache(); // Reset the cache after each test
  });

  describe("Development environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
      resetEnvCache(); // Force reload with new NODE_ENV

      app.get("/error", () => {
        throw new Error("Test error message");
      });
    });

    it("should return actual error message", async () => {
      const res = await app.request("/error");
      const data = (await res.json()) as ErrorResponse;
      expect(data.error.message).toBe("Test error message");
    });

    it("should include stack trace", async () => {
      const res = await app.request("/error");
      const data = (await res.json()) as ErrorResponse;
      expect(data.error.stack).toBeDefined();
      expect(data.error.stack).toContain("Error: Test error message");
    });

    it("should return 500 status", async () => {
      const res = await app.request("/error");
      expect(res.status).toBe(500);
    });

    it("should log error to console", async () => {
      await app.request("/error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Error:",
        expect.any(Error)
      );
    });
  });

  describe("Production environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      resetEnvCache(); // Force reload with new NODE_ENV

      app.get("/error", () => {
        throw new Error("Sensitive error details");
      });
    });

    it("should return generic error message", async () => {
      const res = await app.request("/error");
      const data = (await res.json()) as ErrorResponse;
      expect(data.error.message).toBe("Internal Server Error");
    });

    it("should NOT include stack trace", async () => {
      const res = await app.request("/error");
      const data = (await res.json()) as ErrorResponse;
      expect(data.error.stack).toBeUndefined();
    });

    it("should return 500 status", async () => {
      const res = await app.request("/error");
      expect(res.status).toBe(500);
    });

    it("should still log error to console", async () => {
      await app.request("/error");
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "❌ Error:",
        expect.any(Error)
      );
    });
  });
});
