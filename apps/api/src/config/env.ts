/** biome-ignore-all lint/style/noProcessEnv: we make the process.env typesafe here */
import process from "node:process";
import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),
  LOG_LEVEL: z.enum(["debug", "error", "fatal", "info", "silent", "trace", "warn"]).default("debug"),
  DATABASE_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().nonempty(),
  JWT_REFRESH_SECRET: z.string().nonempty(),
  REDIS_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(processEnv: NodeJS.ProcessEnv): Env {
  return envSchema.parse(processEnv);
}

export let env: Env;

try {
  env = parseEnv(process.env);
} catch (error) {
  console.error("❌ Invalid env", error);
  process.exit(1);
}
