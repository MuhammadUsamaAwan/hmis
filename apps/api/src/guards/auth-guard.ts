import type Elysia from "elysia";
import { ctx } from "../lib/ctx";
import { type Claims, isJtiRevoked } from "../lib/jwt";
import { HttpError } from "../utils/error";

export const authGuard = (app: Elysia) =>
  app.use(ctx).derive({ as: "scoped" }, async ({ headers, query, jwtAccess }) => {
    const auth = headers["authorization"] ?? query["authorization"];
    if (!auth?.startsWith("Bearer ")) {
      throw new HttpError(401, "Unauthorized");
    }

    const token = auth.slice(7);

    const claims = await jwtAccess.verify(token);
    if (!claims) {
      throw new HttpError(401, "Unauthorized");
    }
    const jtiRevoked = await isJtiRevoked(claims.jti);
    if (jtiRevoked) {
      throw new HttpError(401, "Unauthorized");
    }

    return { claims: claims as Claims };
  });
