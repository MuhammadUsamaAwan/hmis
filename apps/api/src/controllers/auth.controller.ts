import { signinSchema } from "@app/validations";
import { eq } from "drizzle-orm";
import Elysia from "elysia";
import { ctx } from "@/api/lib/ctx";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { verifyPassword } from "../lib/crypto";
import type { Claims } from "../lib/jwt";
import { authLimitMiddleware } from "../middleware/rate-limit";
import { HttpError } from "../utils/error";

export const authController = new Elysia()
  .use(ctx)
  .use(
    new Elysia()
      .use(ctx)
      .use(authLimitMiddleware)
      .post(
        "/signin",
        async ({ body, translate, jwtAccess, jwtRefresh, cookie }) => {
          const [user] = await db
            .select({ id: usersTable.id, passwordHash: usersTable.passwordHash })
            .from(usersTable)
            .where(eq(usersTable.email, body.email));

          if (!user) {
            throw new HttpError(401, translate("auth.invalidCredentials"));
          }

          const passwordMatch = await verifyPassword(body.password, user.passwordHash);
          if (!passwordMatch) {
            throw new HttpError(401, translate("auth.invalidCredentials"));
          }

          const payload: Claims = { sub: user.id };

          const [accessToken, refreshToken] = await Promise.all([jwtAccess.sign(payload), jwtRefresh.sign(payload)]);

          cookie["refresh_token"]?.set({
            value: refreshToken,
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 14 * 24 * 60 * 60, // 14 days
            path: "/",
          });

          return { accessToken };
        },
        { body: signinSchema }
      )
  )
  .get("/refresh", async ({ cookie, jwtAccess, jwtRefresh }) => {
    const refreshToken = cookie["refresh_token"]?.value;
    if (!refreshToken) {
      throw new HttpError(401, "Refresh token invalid or expired");
    }

    const verified = await jwtRefresh.verify(refreshToken as string);
    if (!verified) {
      throw new HttpError(401, "Refresh token invalid or expired");
    }

    const payload: Claims = { sub: verified.sub };

    const [accessToken, newRefreshToken] = await Promise.all([jwtAccess.sign(payload), jwtRefresh.sign(payload)]);

    cookie["refresh_token"]?.set({
      value: newRefreshToken,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 14 * 24 * 60 * 60, // 14 days
      path: "/",
    });

    return { accessToken };
  })
  .post("/signout", async ({ cookie }) => {
    cookie["refresh_token"]?.remove();
  });
