import {
  actions,
  bloodGroups,
  genders,
  guardianRelations,
  maritalStatuses,
  patientTypes,
  permissions,
  visitStatuses,
  visitTypes,
} from "@app/validations";
import {
  date,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/*
 * ==========================================
 * Authentication & Authorization
 * ==========================================
 *
 */

export const usersTable = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
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
export const guardianRelationEnum = pgEnum("guardian_relation", guardianRelations);
export const patientTypeEnum = pgEnum("patient_type", patientTypes);
export const visitTypeEnum = pgEnum("visit_type", visitTypes);
export const visitStatusEnum = pgEnum("visit_status", visitStatuses);

/*
 * ==========================================
 * Geographic Hierarchy
 * Country → Province → Division → District → Tehsil
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

/**
 * Monotonic counters for MRN and OPD visit number generation.
 * Key format: "mrn_YYYY" | "visit_YYYY".
 * Incremented atomically via ON CONFLICT DO UPDATE.
 */
export const countersTable = pgTable("counters", {
  key: text("key").primaryKey(),
  value: integer("value").notNull().default(0),
});

export const patientsTable = pgTable("patients", {
  id: uuid("id").defaultRandom().primaryKey(),
  mrn: text("mrn").notNull().unique(),

  firstName: text("first_name").notNull(),
  middleName: text("middle_name"),
  lastName: text("last_name").notNull(),
  guardianRelation: guardianRelationEnum("guardian_relation"),
  guardianName: text("guardian_name"),
  gender: genderEnum("gender").notNull(),
  dateOfBirth: date("date_of_birth", { mode: "string" }).notNull(),
  maritalStatus: maritalStatusEnum("marital_status"),
  bloodGroup: bloodGroupEnum("blood_group"),
  occupation: text("occupation"),

  cnic: text("cnic").unique(),

  phone: text("phone").notNull(),
  alternatePhone: text("alternate_phone"),
  email: text("email"),

  emergencyContactName: text("emergency_contact_name"),
  emergencyContactPhone: text("emergency_contact_phone"),
  emergencyContactRelation: text("emergency_contact_relation"),

  addressId: uuid("address_id").references(() => addressesTable.id),

  patientType: patientTypeEnum("patient_type").notNull().default("new"),

  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
});

export const opdVisitsTable = pgTable("opd_visits", {
  id: uuid("id").defaultRandom().primaryKey(),
  visitNumber: text("visit_number").notNull().unique(),
  patientId: uuid("patient_id")
    .notNull()
    .references(() => patientsTable.id),
  visitType: visitTypeEnum("visit_type").notNull().default("general"),
  visitStatus: visitStatusEnum("visit_status").notNull().default("scheduled"),
  visitDate: timestamp("visit_date", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }).notNull().defaultNow(),
});
