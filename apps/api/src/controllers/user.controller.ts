import { changePasswordSchema, updateProfileSchema } from "@app/validations";
import { eq } from "drizzle-orm";
import Elysia from "elysia";
import { db } from "../db";
import { usersTable } from "../db/schema";
import { authGuard } from "../guards/auth-guard";
import { getUserPermissions } from "../guards/permission-guard";
import { hashPassword, verifyPassword } from "../lib/crypto";
import { revokeAllUserSessions } from "../lib/jwt";
import { HttpError } from "../utils/error";

export const userController = new Elysia({ prefix: "/users" })
  .use(authGuard)
  .get("/me", async ({ claims, translate }) => {
    const [user] = await db
      .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, claims.sub));

    if (!user) {
      throw new HttpError(404, translate("auth.userNotFound"));
    }

    return user;
  })
  .patch(
    "/me",
    async ({ claims, body, translate }) => {
      const [user] = await db
        .update(usersTable)
        .set({ name: body.name, email: body.email, updatedAt: new Date().toISOString() })
        .where(eq(usersTable.id, claims.sub))
        .returning({ id: usersTable.id, name: usersTable.name, email: usersTable.email });

      if (!user) {
        throw new HttpError(404, translate("auth.userNotFound"));
      }

      return user;
    },
    { body: updateProfileSchema }
  )
  .post(
    "/me/change-password",
    async ({ claims, body, translate, cookie }) => {
      const [user] = await db
        .select({ id: usersTable.id, passwordHash: usersTable.passwordHash })
        .from(usersTable)
        .where(eq(usersTable.id, claims.sub));

      if (!user) {
        throw new HttpError(404, translate("auth.userNotFound"));
      }

      const passwordMatch = await verifyPassword(body.currentPassword, user.passwordHash);
      if (!passwordMatch) {
        throw new HttpError(400, translate("auth.invalidCredentials"));
      }

      const newHash = await hashPassword(body.newPassword);
      await db
        .update(usersTable)
        .set({ passwordHash: newHash, updatedAt: new Date().toISOString() })
        .where(eq(usersTable.id, claims.sub));

      await revokeAllUserSessions(claims.sub);
      cookie["refresh_token"]?.remove();
    },
    { body: changePasswordSchema }
  )
  .get("/me/permissions", async ({ claims }) => {
    const permissions = await getUserPermissions(claims.sub);
    return [...permissions];
  });
