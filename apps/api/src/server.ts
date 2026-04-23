import process from "node:process";
import { createApp } from "./app";
import { env } from "./config/env";
import { bus } from "./events";
import { registerWsHandlers } from "./events/handlers";
import { log } from "./lib/logger";
import { jobSystem } from "./lib/queue";
import { redisClient } from "./lib/redis";
import { registerWorkers } from "./queues";

async function bootstrap() {
  await redisClient.init();
  registerWorkers();
  await bus.connect();
  registerWsHandlers();

  const app = createApp().listen(env.PORT);
  log.info(`API running at ${app.server?.hostname}:${app.server?.port}`);
}

await bootstrap();

async function shutdown() {
  await bus.disconnect();
  await redisClient.close();
  await jobSystem.close();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
