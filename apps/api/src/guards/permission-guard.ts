import type { Permission } from "@app/validations";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { permissionsTable, rolePermissionTable, userRoleTable } from "../db/schema";
import { HttpError } from "../utils/error";

export async function getUserPermissions(userId: string): Promise<Set<string>> {
  const rows = await db
    .select({ name: permissionsTable.name })
    .from(userRoleTable)
    .innerJoin(rolePermissionTable, eq(userRoleTable.roleId, rolePermissionTable.roleId))
    .innerJoin(permissionsTable, eq(rolePermissionTable.permissionId, permissionsTable.id))
    .where(eq(userRoleTable.userId, userId));

  return new Set(rows.map(r => r.name));
}

export const requirePermissions =
  (...required: Permission[]) =>
  async ({ claims }: { claims: { sub: string } }) => {
    const permissions = await getUserPermissions(claims.sub);
    if (!required.every(p => permissions.has(p))) {
      throw new HttpError(403, "Forbidden");
    }
  };
