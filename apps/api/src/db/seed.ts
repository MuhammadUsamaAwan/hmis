import { permissions } from "@app/validations";
import { eq } from "drizzle-orm";
import { hashPassword } from "../lib/crypto";
import { log } from "../lib/logger";
import { db } from ".";
import countriesData from "./data/countries.json";
import geoData from "./data/geographic-data.json";
import {
  countriesTable,
  districtsTable,
  divisionsTable,
  permissionsTable,
  provincesTable,
  rolePermissionTable,
  rolesTable,
  tehsilsTable,
  userRoleTable,
  usersTable,
} from "./schema";

export const SEED_ADMIN = {
  id: "a57c32cc-9c2a-478b-b5b8-f4bc1c1a8add",
  email: "admin@test.com",
  password: "Admin@123",
};

export async function runSeed() {
  // Users
  const passwordHash = await hashPassword(SEED_ADMIN.password);
  await db
    .insert(usersTable)
    .values({ id: SEED_ADMIN.id, email: SEED_ADMIN.email, passwordHash })
    .onConflictDoNothing();

  // Roles
  const [role] = await db
    .insert(rolesTable)
    .values({ name: "admin" })
    .onConflictDoUpdate({ target: rolesTable.name, set: { name: rolesTable.name } })
    .returning({ id: rolesTable.id });
  if (!role) {
    throw new Error("Admin role not seeded correctly");
  }

  // Permissions
  const perms = await db
    .insert(permissionsTable)
    .values(permissions.map(p => ({ name: p })))
    .onConflictDoUpdate({ target: permissionsTable.name, set: { name: permissionsTable.name } })
    .returning({ id: permissionsTable.id });

  // Role Permissions
  await db
    .insert(rolePermissionTable)
    .values(perms.map(p => ({ roleId: role.id, permissionId: p.id })))
    .onConflictDoNothing();

  // User Role
  await db.insert(userRoleTable).values({ userId: SEED_ADMIN.id, roleId: role.id }).onConflictDoNothing();

  // Countries
  await db
    .insert(countriesTable)
    .values(countriesData.countries.map(c => ({ name: c.name, code: c.code })))
    .onConflictDoNothing();
  const [pakistan] = await db
    .select({ id: countriesTable.id })
    .from(countriesTable)
    .where(eq(countriesTable.name, "Pakistan"));
  if (!pakistan) {
    throw new Error("Countries not seeded correctly");
  }

  // Provinces
  await db
    .insert(provincesTable)
    .values(geoData.provinces.map(p => ({ name: p.name, countryId: pakistan.id })))
    .onConflictDoNothing();
  const dbProvinces = await db.select({ id: provincesTable.id, name: provincesTable.name }).from(provincesTable);
  const provinceIdMap = new Map(geoData.provinces.map(p => [p.id, dbProvinces.find(r => r.name === p.name)?.id ?? ""]));

  // Divisions
  await db
    .insert(divisionsTable)
    .values(
      geoData.divisions.map(d => ({ name: d.name, provinceId: requireId(provinceIdMap, d.province_id, "province") }))
    )
    .onConflictDoNothing();
  const dbDivisions = await db.select({ id: divisionsTable.id, name: divisionsTable.name }).from(divisionsTable);
  const divisionIdMap = new Map(geoData.divisions.map(d => [d.id, dbDivisions.find(r => r.name === d.name)?.id ?? ""]));

  // Districts
  await db
    .insert(districtsTable)
    .values(
      geoData.districts.map(d => ({ name: d.name, divisionId: requireId(divisionIdMap, d.division_id, "division") }))
    )
    .onConflictDoNothing();
  const dbDistricts = await db.select({ id: districtsTable.id, name: districtsTable.name }).from(districtsTable);
  const districtIdMap = new Map(geoData.districts.map(d => [d.id, dbDistricts.find(r => r.name === d.name)?.id ?? ""]));

  // Tehsils — some have null district_id (inferred/incomplete)
  const validTehsils = geoData.tehsils.filter((t): t is typeof t & { district_id: number } => t.district_id !== null);
  await db
    .insert(tehsilsTable)
    .values(validTehsils.map(t => ({ name: t.name, districtId: requireId(districtIdMap, t.district_id, "district") })))
    .onConflictDoNothing();
}

function requireId<K>(map: Map<K, string>, key: K, label: string): string {
  const id = map.get(key);
  if (!id) {
    throw new Error(`Seed: missing DB id for ${label} key=${String(key)}`);
  }
  return id;
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
