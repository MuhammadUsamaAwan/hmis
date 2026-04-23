import Elysia from "elysia";
import { authGuard } from "../guards/auth-guard";
import { getUserPermissions } from "../guards/permission-guard";

export const userController = new Elysia({ prefix: "/users" })
  .use(authGuard)
  .get("/me/permissions", async ({ claims }) => {
    const permissions = await getUserPermissions(claims.sub);
    return [...permissions];
  });
