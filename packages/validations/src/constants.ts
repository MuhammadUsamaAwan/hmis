export const PERMISSIONS = {
  CREATE_PATIENT: "Create Patient",
  VIEW_PATIENTS: "View Patients",
  UPDATE_PATIENT: "Update Patient",
} as const;
export const permissions = Object.values(PERMISSIONS) as [Permission, ...Permission[]];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ACTIONS = {
  VIEW: "view",
  CREATE: "create",
  UPDATE: "update",
  DELETE: "delete",
} as const;
export const actions = Object.values(ACTIONS) as [Action, ...Action[]];
export type Action = (typeof ACTIONS)[keyof typeof ACTIONS];

export const BLOOD_GROUPS = {
  A_POSITIVE: "A+",
  A_NEGATIVE: "A-",
  B_POSITIVE: "B+",
  B_NEGATIVE: "B-",
  AB_POSITIVE: "AB+",
  AB_NEGATIVE: "AB-",
  O_POSITIVE: "O+",
  O_NEGATIVE: "O-",
} as const;
export const bloodGroups = Object.values(BLOOD_GROUPS) as [BloodGroup, ...BloodGroup[]];
export type BloodGroup = (typeof BLOOD_GROUPS)[keyof typeof BLOOD_GROUPS];

export const GENDERS = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
} as const;
export type Gender = (typeof GENDERS)[keyof typeof GENDERS];
export const genders = Object.values(GENDERS) as [Gender, ...Gender[]];

export const MARITAL_STATUSES = {
  SINGLE: "single",
  MARRIED: "married",
  DIVORCED: "divorced",
  WIDOWED: "widowed",
  SEPARATED: "separated",
} as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[keyof typeof MARITAL_STATUSES];
export const maritalStatuses = Object.values(MARITAL_STATUSES) as [MaritalStatus, ...MaritalStatus[]];
