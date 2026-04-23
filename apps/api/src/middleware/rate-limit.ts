import Elysia from "elysia";
import { ip } from "elysia-ip";
import { RateLimiterMemory, RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../lib/redis";
import { HttpError } from "../utils/error";

interface LimiterOptions {
  keyPrefix: string;
  points: number;
  duration: number;
}

function createLimiter({ keyPrefix, points, duration }: LimiterOptions) {
  const redis = redisClient.get();
  return new RateLimiterRedis({
    storeClient: redis,
    keyPrefix,
    points,
    duration,
    insuranceLimiter: new RateLimiterMemory({ points, duration }),
  });
}

function createRateLimitMiddleware(options: LimiterOptions, as: "global" | "local") {
  let limiter: RateLimiterRedis | null = null;

  return new Elysia().use(ip()).derive({ as }, async ({ ip: clientIp }) => {
    limiter ??= createLimiter(options);
    try {
      await limiter.consume(clientIp ?? "unknown");
    } catch {
      throw new HttpError(429, "Too many requests, please try again later.");
    }
  });
}

// 100 req / min — applied globally
export const rateLimitMiddleware = () =>
  createRateLimitMiddleware({ keyPrefix: "rl:api", points: 100, duration: 60 }, "global");

// 15 req / min — applied on auth routes
export const authLimitMiddleware = () =>
  createRateLimitMiddleware({ keyPrefix: "rl:auth", points: 15, duration: 60 }, "local");
