import { afterAll, beforeAll, mock } from "bun:test";
import { pushSchema } from "drizzle-kit/api";
import { drizzle } from "drizzle-orm/pglite";
// biome-ignore lint/performance/noNamespaceImport: fine for tests
import * as schema from "./db/schema";

const testDb = drizzle();

mock.module("./db", () => ({ db: testDb }));

beforeAll(async () => {
  const { apply } = await pushSchema(schema, testDb);
  await apply();
  const { runSeed } = await import("./db/seed");
  await runSeed();
});

afterAll(async () => {
  await testDb.$client.close();
});
