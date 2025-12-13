import type { Plugin } from "graphql-yoga";
import { env } from "../../config/env";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

/**
 * Simple in-memory rate limiter
 * Production: Use Redis for distributed rate limiting
 *
 * Limits:
 * - 100 requests per minute per IP
 * - 1000 requests per hour per IP
 */
export function createRateLimiterPlugin(
  requestsPerMinute: number = 100,
  requestsPerHour: number = 1000
): Plugin {
  const minuteStore: RateLimitStore = {};
  const hourStore: RateLimitStore = {};

  // Cleanup old entries every 5 minutes
  setInterval(() => {
    const now = Date.now();

    Object.keys(minuteStore).forEach((key) => {
      if (minuteStore[key].resetTime < now) {
        delete minuteStore[key];
      }
    });

    Object.keys(hourStore).forEach((key) => {
      if (hourStore[key].resetTime < now) {
        delete hourStore[key];
      }
    });
  }, 5 * 60 * 1000);

  return {
    onRequest: ({ request, fetchAPI, endResponse }) => {
      // Skip rate limiting in development
      if (env.NODE_ENV === "development") {
        return;
      }

      // Get client IP
      const forwarded = request.headers.get("x-forwarded-for");
      const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

      const now = Date.now();

      // Check minute limit
      const minuteKey = `${ip}:minute`;
      if (!minuteStore[minuteKey]) {
        minuteStore[minuteKey] = {
          count: 0,
          resetTime: now + 60 * 1000, // 1 minute
        };
      }

      if (minuteStore[minuteKey].resetTime < now) {
        // Reset
        minuteStore[minuteKey] = {
          count: 0,
          resetTime: now + 60 * 1000,
        };
      }

      minuteStore[minuteKey].count++;

      if (minuteStore[minuteKey].count > requestsPerMinute) {
        const resetIn = Math.ceil(
          (minuteStore[minuteKey].resetTime - now) / 1000
        );

        endResponse(
          new fetchAPI.Response(
            JSON.stringify({
              errors: [
                {
                  message: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
                  extensions: {
                    code: "RATE_LIMIT_EXCEEDED",
                    resetIn,
                  },
                },
              ],
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": String(resetIn),
              },
            }
          )
        );
        return;
      }

      // Check hour limit
      const hourKey = `${ip}:hour`;
      if (!hourStore[hourKey]) {
        hourStore[hourKey] = {
          count: 0,
          resetTime: now + 60 * 60 * 1000, // 1 hour
        };
      }

      if (hourStore[hourKey].resetTime < now) {
        // Reset
        hourStore[hourKey] = {
          count: 0,
          resetTime: now + 60 * 60 * 1000,
        };
      }

      hourStore[hourKey].count++;

      if (hourStore[hourKey].count > requestsPerHour) {
        const resetIn = Math.ceil((hourStore[hourKey].resetTime - now) / 1000);

        endResponse(
          new fetchAPI.Response(
            JSON.stringify({
              errors: [
                {
                  message: `Hourly rate limit exceeded. Try again in ${Math.ceil(
                    resetIn / 60
                  )} minutes.`,
                  extensions: {
                    code: "RATE_LIMIT_EXCEEDED",
                    resetIn,
                  },
                },
              ],
            }),
            {
              status: 429,
              headers: {
                "Content-Type": "application/json",
                "Retry-After": String(resetIn),
              },
            }
          )
        );
        return;
      }

      if (env.LOG_LEVEL === "debug") {
        console.log(
          `[Rate Limit] ${ip}: ${minuteStore[minuteKey].count}/${requestsPerMinute} per minute, ${hourStore[hourKey].count}/${requestsPerHour} per hour`
        );
      }
    },
  };
}
