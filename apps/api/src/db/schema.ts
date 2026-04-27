import { actions, bloodGroups, genders, maritalStatuses, permissions } from "@app/validations";
import { jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

/*
 * ==========================================
 * Authentication & Authorization
 * ==========================================
 *
 */

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
});

export const rolesTable = pgTable("roles", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const permissionEnum = pgEnum("permission", permissions);

export const permissionsTable = pgTable("permissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: permissionEnum("name").notNull().unique(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const rolePermissionTable = pgTable(
  "role_permission",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => rolesTable.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissionsTable.id, { onDelete: "cascade" }),
  },
  t => [primaryKey({ columns: [t.roleId, t.permissionId] })]
);

export const userRoleTable = pgTable(
  "user_role",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => rolesTable.id, { onDelete: "cascade" }),
  },
  t => [primaryKey({ columns: [t.userId, t.roleId] })]
);
/*
 * ==========================================
 * Audit Log
 * ==========================================
 *
 */

export const signinsTable = pgTable("signins", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  jti: text("jti").notNull(),
  clientInfo: jsonb("client_info"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
});

export const actionEnum = pgEnum("action", actions);

export const AUDITED_TABLES = {
  USERS: "users",
  ROLES: "roles",
  ROLE_PERMISSION: "rolePermission",
  USER_ROLE: "userRole",
} as const;
export const auditedTables = Object.values(AUDITED_TABLES) as [AuditedTable, ...AuditedTable[]];
export type AuditedTable = (typeof AUDITED_TABLES)[keyof typeof AUDITED_TABLES];
export const auditedTableEnum = pgEnum("audited_table", auditedTables);

export const auditLogTable = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id),
  tableName: auditedTableEnum("table_name").notNull(),
  rowId: text("row_id").notNull(),
  action: actionEnum("action").notNull(),
  oldData: jsonb("old_data"),
  newData: jsonb("new_data"),
  clientInfo: jsonb("client_info"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

/*
 * ==========================================
 * OPD — Enums
 * ==========================================
 */

export const maritalStatusEnum = pgEnum("marital_status", maritalStatuses);

export const bloodGroupEnum = pgEnum("blood_group", bloodGroups);

export const genderEnum = pgEnum("gender", genders);

/*
 * ==========================================
 * Geographic Hierarchy
 * Country → Province → Division → District → Tehsil -> Union Council
 * ==========================================
 */

export const countriesTable = pgTable("countries", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const provincesTable = pgTable("provinces", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  countryId: uuid("country_id")
    .notNull()
    .references(() => countriesTable.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const divisionsTable = pgTable("divisions", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  provinceId: uuid("province_id")
    .notNull()
    .references(() => provincesTable.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const districtsTable = pgTable("districts", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  divisionId: uuid("division_id")
    .notNull()
    .references(() => divisionsTable.id),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

export const tehsilsTable = pgTable(
  "tehsils",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    districtId: uuid("district_id")
      .notNull()
      .references(() => districtsTable.id),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  },
  t => [uniqueIndex().on(t.name, t.districtId)]
);

/*
 * ==========================================
 * OPD — Addresses
 * ==========================================
 */

export const addressesTable = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  area: text("area"),
  tehsilId: uuid("tehsil_id")
    .notNull()
    .references(() => tehsilsTable.id),
  postalCode: text("postal_code"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});

/*
 * ==========================================
 * OPD — Patients
 * ==========================================
 */
