import { permissions } from "@app/validations";
import { hashPassword } from "../lib/crypto";
import { log } from "../lib/logger";
import { db } from ".";
import { permissionsTable, rolePermissionTable, rolesTable, userRoleTable, usersTable } from "./schema";

export const SEED_ADMIN = {
  id: "a57c32cc-9c2a-478b-b5b8-f4bc1c1a8add",
  email: "admin@test.com",
  password: "Admin@123",
};

export async function runSeed() {
  const passwordHash = await hashPassword(SEED_ADMIN.password);

  await db
    .insert(usersTable)
    .values({ id: SEED_ADMIN.id, email: SEED_ADMIN.email, passwordHash })
    .onConflictDoNothing();

  const [role] = await db
    .insert(rolesTable)
    .values({ name: "admin" })
    .onConflictDoUpdate({ target: rolesTable.name, set: { name: rolesTable.name } })
    .returning({ id: rolesTable.id });

  if (!role) {
    throw new Error("Admin role not seeded correctly");
  }

  const perms = await db
    .insert(permissionsTable)
    .values(permissions.map(p => ({ name: p })))
    .onConflictDoUpdate({ target: permissionsTable.name, set: { name: permissionsTable.name } })
    .returning({ id: permissionsTable.id });

  await db
    .insert(rolePermissionTable)
    .values(perms.map(p => ({ roleId: role.id, permissionId: p.id })))
    .onConflictDoNothing();

  await db.insert(userRoleTable).values({ userId: SEED_ADMIN.id, roleId: role.id }).onConflictDoNothing();
}

if (import.meta.main) {
  const startTime = Date.now();

  runSeed()
    .then(() => {
      const endTime = Date.now();
      log.info(`DB seed completed successfully in ${endTime - startTime}ms`);
    })
    .catch(error => {
      const endTime = Date.now();
      log.error(error, `DB seed failed in ${endTime - startTime}ms`);
    });
}
