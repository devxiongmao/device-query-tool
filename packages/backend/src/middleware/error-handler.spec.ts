import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Hono } from "hono";
import { env } from "../config/env";
import { errorHandler } from "./error-handler";

// Type definitions for error responses
type ErrorResponse = {
  error: {
    message: string;
    stack?: string;
  };
};

// Mock the env module
vi.mock("../config/env", () => ({
  env: {
    NODE_ENV: "development",
    DATABASE_URL: "postgresql://localhost:5432/testdb",
    DB_HOST: "localhost",
    DB_PORT: 5432,
    DB_NAME: "test_db",
    DB_USER: "test_user",
    DB_PASSWORD: "test_password",
    PORT: 3000,
    CORS_ORIGIN: "http://localhost:5173",
    LOG_LEVEL: "info" as const,
  },
}));

describe("errorHandler middleware", () => {
  let app: Hono;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    app = new Hono();
    app.onError(errorHandler);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe("Development environment", () => {
    beforeEach(() => {
      // Mutate the mocked env object
      env.NODE_ENV = "development";

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
      // Mutate the mocked env object
      env.NODE_ENV = "production";

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
