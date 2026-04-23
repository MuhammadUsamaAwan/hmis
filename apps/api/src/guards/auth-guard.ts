import type Elysia from "elysia";
import { ctx } from "../lib/ctx";
import { HttpError } from "../utils/error";

export const authGuard = (app: Elysia) =>
  app.use(ctx).derive({ as: "scoped" }, async ({ headers, query, jwtAccess }) => {
    const auth = headers["authorization"] ?? query["authorization"];
    if (!auth?.startsWith("Bearer ")) {
      throw new HttpError(401, "Unauthorized");
    }

    const token = auth.slice(7);

    const verified = await jwtAccess.verify(token);
    if (!verified) {
      throw new HttpError(401, "Unauthorized");
    }

    const claims = { sub: verified.sub };

    return { claims };
  });
