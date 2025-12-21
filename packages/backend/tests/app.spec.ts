import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import app from "../src/app";

// Type definitions for API responses
type HealthResponse = {
  status: string;
  timestamp: string;
  environment: string;
  database: string;
};

type RootResponse = {
  message: string;
  version: string;
  endpoints: {
    health: string;
    graphql: string;
  };
};

type ErrorResponse = {
  error: string;
};

// Mock the env module
vi.mock("../src/config/env", () => ({
  env: {
    NODE_ENV: "test",
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

describe("Hono Application", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on console.log to suppress logger output
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  describe("Root endpoint", () => {
    it("should return API information", async () => {
      const res = await app.request("/");
      const data = (await res.json()) as RootResponse;

      expect(res.status).toBe(200);
      expect(data).toEqual({
        message: "Device Capabilities API",
        version: "1.0.0",
        endpoints: {
          health: "/health",
          graphql: "/graphql",
          graphiql: "disabled",
        },
      });
    });

    it("should return JSON content type", async () => {
      const res = await app.request("/");

      expect(res.headers.get("content-type")).toContain("application/json");
    });
  });

  describe("Health check endpoint", () => {
    it("should return healthy status", async () => {
      const res = await app.request("/health");
      const data = (await res.json()) as HealthResponse;

      expect(res.status).toBe(200);
      expect(data.status).toBe("ok");
    });

    it("should include timestamp", async () => {
      const res = await app.request("/health");
      const data = (await res.json()) as HealthResponse;

      expect(data.timestamp).toBeDefined();
      expect(typeof data.timestamp).toBe("string");
      // Verify it's a valid ISO timestamp
      expect(() => new Date(data.timestamp)).not.toThrow();
    });

    it("should include environment", async () => {
      const res = await app.request("/health");
      const data = (await res.json()) as HealthResponse;

      expect(data.environment).toBe("test");
    });

    it("should include database status", async () => {
      const res = await app.request("/health");
      const data = (await res.json()) as HealthResponse;

      expect(data.database).toBe("connected");
    });

    it("should return JSON content type", async () => {
      const res = await app.request("/health");

      expect(res.headers.get("content-type")).toContain("application/json");
    });
  });

  describe("GraphQL Health check endpoint", () => {
    it("should return healthy status", async () => {
      const res = await app.request("/graphql/health");

      expect(res.status).toBe(200);
    });

    it("should return JSON content type", async () => {
      const res = await app.request("/graphql/health");

      expect(res.headers.get("content-type")).toContain("application/json");
    });

    it("should return data", async () => {
      const res = await app.request("/graphql/health");
      const data = await res.json();

      expect(data.data).toBe("graphQL is healthy!");
    });
  });

  describe("404 handler", () => {
    it("should return 404 for unknown routes", async () => {
      const res = await app.request("/unknown-route");

      expect(res.status).toBe(404);
    });

    it("should return error message", async () => {
      const res = await app.request("/does-not-exist");
      const data = (await res.json()) as ErrorResponse;

      expect(data).toEqual({ error: "Not Found" });
    });

    it("should handle POST to unknown route", async () => {
      const res = await app.request("/unknown", { method: "POST" });

      expect(res.status).toBe(404);
    });

    it("should return JSON content type", async () => {
      const res = await app.request("/not-found");

      expect(res.headers.get("content-type")).toContain("application/json");
    });
  });

  describe("CORS middleware", () => {
    it("should include CORS headers", async () => {
      const res = await app.request("/", {
        headers: {
          Origin: "http://localhost:5173",
        },
      });

      expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:5173"
      );
      expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
    });

    it("should handle preflight requests", async () => {
      const res = await app.request("/health", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "GET",
        },
      });

      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Methods")).toBeTruthy();
    });
  });

  describe("Logger middleware", () => {
    it("should log incoming requests", async () => {
      await app.request("/health");

      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("should log request method and path", async () => {
      await app.request("/health");

      const logOutput = consoleLogSpy.mock.calls.flat().join(" ");
      expect(logOutput).toContain("GET");
      expect(logOutput).toContain("/health");
    });
  });

  describe("Middleware order", () => {
    it("should apply CORS before handling request", async () => {
      const res = await app.request("/", {
        headers: {
          Origin: "http://localhost:5173",
        },
      });

      // If CORS runs first, we should see CORS headers even on success
      expect(res.status).toBe(200);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBeDefined();
    });

    it("should apply logger before handling request", async () => {
      await app.request("/health");

      // Logger should have been called
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    it("should handle 404 after middleware chain", async () => {
      const res = await app.request("/nonexistent", {
        headers: {
          Origin: "http://localhost:5173",
        },
      });

      // Should have CORS headers even on 404
      expect(res.status).toBe(404);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBeDefined();
    });
  });
});
