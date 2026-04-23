import { afterAll, beforeAll, mock } from "bun:test";
import { pushSchema } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/pglite";
import { SignJWT } from "jose";
import { env } from "./config/env";
// biome-ignore lint/performance/noNamespaceImport: fine for tests
import * as schema from "./db/schema";
import { SEED_ADMIN } from "./db/seed";

const testDb = drizzle();

mock.module("./db", () => ({ db: testDb }));

export let accessToken: string;

beforeAll(async () => {
  const { apply } = await pushSchema(schema, testDb);
  await apply();
  const { runSeed } = await import("./db/seed");
  await runSeed();

  const secret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
  const alg = "HS256";
  accessToken = await new SignJWT().setProtectedHeader({ alg }).setSubject(SEED_ADMIN.id).sign(secret);
});

afterAll(async () => {
  await testDb.$client.close();
});
