import IORedis, { type RedisOptions } from "ioredis";
import { env } from "../config/env";
import { log } from "./logger";

// used for bullmq and pubsub
export function createRedisClient(options: RedisOptions = {}): IORedis {
  return new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    lazyConnect: false,
    ...options,
  });
}

// singleton class
export class RedisClient {
  private client: IORedis | null = null;

  async init(): Promise<IORedis> {
    if (this.client?.status === "ready") {
      return this.client;
    }

    this.client = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      lazyConnect: true,
    });

    this.client.on("error", err => log.error(err, "Redis error"));
    this.client.on("ready", () => log.info("Redis ready"));
    this.client.on("close", () => log.warn("Redis connection closed"));
    this.client.on("reconnecting", (delay: number) => log.info(`Redis reconnecting in ${delay}ms...`));

    await this.client.connect();
    return this.client;
  }

  get(): IORedis {
    if (!this.client || this.client.status !== "ready") {
      throw new Error("Redis not initialized. Call await redisClient.init() first.");
    }
    return this.client;
  }

  async close(): Promise<void> {
    if (!this.client) {
      return;
    }

    const client = this.client;
    this.client = null;

    try {
      await client.quit();
      log.info("Redis connection closed gracefully");
    } catch (err) {
      log.warn({ err }, "Redis Graceful quit failed, forcing disconnect");
      client.disconnect();
    } finally {
      client.removeAllListeners();
    }
  }
}

export const redisClient = new RedisClient();
