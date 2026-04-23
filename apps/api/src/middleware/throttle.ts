import Elysia from "elysia";
import { env } from "@/api/config/env";

export const throttleMiddleware = new Elysia().derive({ as: "global" }, async () => {
  if (env.NODE_ENV === "development") {
    await Bun.sleep(1000);
  }
});
