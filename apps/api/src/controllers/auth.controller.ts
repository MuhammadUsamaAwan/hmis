import { signinSchema } from "@app/validations";
import { eq } from "drizzle-orm";
import Elysia from "elysia";
import { ctx } from "@/api/lib/ctx";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { generateUUID, verifyPassword } from "../lib/crypto";
import { type Claims, consumeJti, setJti } from "../lib/jwt";
import { parseUA } from "../lib/ua";
import { authLimitMiddleware } from "../middleware/rate-limit";
import { signinProducer } from "../queues";
import { HttpError } from "../utils/error";

export const authController = new Elysia()
  .use(ctx)
  .use(
    new Elysia()
      .use(ctx)
      .use(authLimitMiddleware)
      .post(
        "/signin",
        async ({ body, translate, jwtAccess, jwtRefresh, cookie, headers, ip }) => {
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

          const jti = generateUUID();
          const payload: Claims = { jti, sub: user.id };

          const [accessToken, refreshToken] = await Promise.all([
            jwtAccess.sign(payload),
            jwtRefresh.sign(payload),
            setJti(jti, { ...payload, ...parseUA(headers["user-agent"], ip) }),
            signinProducer.add({ userId: user.id, jti, clientInfo: parseUA(headers["user-agent"], ip) }),
          ]);

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
  .get("/refresh", async ({ cookie, jwtAccess, jwtRefresh, headers, ip }) => {
    const refreshToken = cookie["refresh_token"]?.value;
    if (!refreshToken) {
      throw new HttpError(401, "Refresh token invalid or expired");
    }

    const claims = await jwtRefresh.verify(refreshToken as string);
    if (!claims) {
      throw new HttpError(401, "Refresh token invalid or expired");
    }

    const consumed = await consumeJti(claims.jti);
    if (!consumed) {
      throw new HttpError(401, "Refresh token invalid or expired");
    }

    const jti = generateUUID();
    const payload: Claims = { jti, sub: claims.sub };

    const [accessToken, newRefreshToken] = await Promise.all([
      jwtAccess.sign(payload),
      jwtRefresh.sign(payload),
      setJti(jti, { ...payload, ...parseUA(headers["user-agent"], ip) }),
    ]);

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
  .post("/signout", async ({ cookie, jwtRefresh }) => {
    const refreshToken = cookie["refresh_token"]?.value;
    cookie["refresh_token"]?.remove();
    if (refreshToken) {
      const claims = await jwtRefresh.verify(refreshToken as string);
      if (claims) {
        await consumeJti(claims.jti);
      }
    }
  });
