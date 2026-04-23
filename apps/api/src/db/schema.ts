import { permissions } from "@app/validations";
import { jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

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
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
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

export const ACTIONS = {
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;
export const actions = Object.values(ACTIONS) as [Action, ...Action[]];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];
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
