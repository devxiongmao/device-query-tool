import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { cors } from "./cors";

describe("cors middleware", () => {
  let app: Hono;

  beforeAll(() => {
    // Create a test app with the CORS middleware
    app = new Hono();
    app.use("*", cors);

    // Add a simple test route
    app.get("/test", (c) => c.json({ message: "success" }));
    app.post("/test", (c) => c.json({ message: "created" }));
  });

  describe("CORS headers", () => {
    it("should include Access-Control-Allow-Origin header with configured origin", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "GET",
        headers: {
          Origin: "http://localhost:5173",
        },
      });

      // Assert
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:5173"
      );
    });

    it("should include Access-Control-Allow-Credentials header", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "GET",
        headers: {
          Origin: "http://localhost:5173",
        },
      });

      // Assert
      expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
    });

    it("should respond to OPTIONS preflight request", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type",
        },
      });

      // Assert
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:5173"
      );
    });

    it("should include Access-Control-Allow-Methods header in preflight response", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
        },
      });

      // Assert
      const allowMethods = res.headers.get("Access-Control-Allow-Methods");
      expect(allowMethods).toBeTruthy();

      // Check that all configured methods are present
      expect(allowMethods).toContain("GET");
      expect(allowMethods).toContain("POST");
      expect(allowMethods).toContain("PUT");
      expect(allowMethods).toContain("DELETE");
      expect(allowMethods).toContain("OPTIONS");
    });

    it("should include Access-Control-Allow-Headers header in preflight response", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type, Authorization",
        },
      });

      // Assert
      const allowHeaders = res.headers.get("Access-Control-Allow-Headers");
      expect(allowHeaders).toBeTruthy();

      // Check that configured headers are present
      expect(allowHeaders?.toLowerCase()).toContain("content-type");
      expect(allowHeaders?.toLowerCase()).toContain("authorization");
    });
  });

  describe("Allowed methods", () => {
    it("should allow GET requests", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "GET",
        headers: {
          Origin: "http://localhost:5173",
        },
      });

      // Assert
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ message: "success" });
    });

    it("should allow POST requests", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "POST",
        headers: {
          Origin: "http://localhost:5173",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "data" }),
      });

      // Assert
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ message: "created" });
    });

    it("should handle PUT requests in preflight", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "PUT",
        },
      });

      // Assert
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Methods")).toContain("PUT");
    });

    it("should handle DELETE requests in preflight", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "DELETE",
        },
      });

      // Assert
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Methods")).toContain(
        "DELETE"
      );
    });
  });

  describe("Allowed headers", () => {
    it("should allow Content-Type header", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "POST",
        headers: {
          Origin: "http://localhost:5173",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "data" }),
      });

      // Assert
      expect(res.status).toBe(200);
    });

    it("should allow Authorization header", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "GET",
        headers: {
          Origin: "http://localhost:5173",
          Authorization: "Bearer test-token",
        },
      });

      // Assert
      expect(res.status).toBe(200);
    });

    it("should handle both Content-Type and Authorization in preflight", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type, Authorization",
        },
      });

      // Assert
      expect(res.status).toBe(204);
      const allowHeaders = res.headers.get("Access-Control-Allow-Headers");
      expect(allowHeaders?.toLowerCase()).toContain("content-type");
      expect(allowHeaders?.toLowerCase()).toContain("authorization");
    });
  });

  describe("Credentials", () => {
    it("should allow credentials in actual requests", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "GET",
        headers: {
          Origin: "http://localhost:5173",
          Cookie: "session=abc123",
        },
      });

      // Assert
      expect(res.status).toBe(200);
      expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
    });

    it("should allow credentials in preflight requests", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
        },
      });

      // Assert
      expect(res.status).toBe(204);
      expect(res.headers.get("Access-Control-Allow-Credentials")).toBe("true");
    });
  });

  describe("Origin validation", () => {
    it("should accept requests from configured origin", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "GET",
        headers: {
          Origin: "http://localhost:5173",
        },
      });

      // Assert
      expect(res.status).toBe(200);
      expect(res.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:5173"
      );
    });

    it("should handle requests without Origin header", async () => {
      // Arrange & Act
      const res = await app.request("/test", {
        method: "GET",
      });

      // Assert
      // Request should still succeed (same-origin requests don't need CORS)
      expect(res.status).toBe(200);
    });
  });

  describe("Integration", () => {
    it("should handle complete CORS flow: preflight + actual request", async () => {
      // Arrange & Act - Preflight
      const preflightRes = await app.request("/test", {
        method: "OPTIONS",
        headers: {
          Origin: "http://localhost:5173",
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type, Authorization",
        },
      });

      // Assert - Preflight
      expect(preflightRes.status).toBe(204);
      expect(preflightRes.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:5173"
      );
      expect(
        preflightRes.headers.get("Access-Control-Allow-Methods")
      ).toContain("POST");
      expect(preflightRes.headers.get("Access-Control-Allow-Credentials")).toBe(
        "true"
      );

      // Act - Actual request
      const actualRes = await app.request("/test", {
        method: "POST",
        headers: {
          Origin: "http://localhost:5173",
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
        body: JSON.stringify({ test: "data" }),
      });

      // Assert - Actual request
      expect(actualRes.status).toBe(200);
      expect(actualRes.headers.get("Access-Control-Allow-Origin")).toBe(
        "http://localhost:5173"
      );
      expect(actualRes.headers.get("Access-Control-Allow-Credentials")).toBe(
        "true"
      );

      const data = await actualRes.json();
      expect(data).toEqual({ message: "created" });
    });
  });
});
