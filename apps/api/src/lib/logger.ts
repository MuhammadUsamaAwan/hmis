import { createPinoLogger } from "@bogeychan/elysia-logger";
import { env } from "@/api/config/env";

export const log = createPinoLogger({
  level: env.LOG_LEVEL,
});
