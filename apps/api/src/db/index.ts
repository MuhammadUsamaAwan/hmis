import { drizzle } from "drizzle-orm/bun-sql";
import { env } from "../config/env";

export const db = drizzle(env.DATABASE_URL);
