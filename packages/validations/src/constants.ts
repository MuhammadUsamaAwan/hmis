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

export const GUARDIAN_RELATIONS = {
  SON_OF: "son_of",
  DAUGHTER_OF: "daughter_of",
  WIFE_OF: "wife_of",
} as const;
export type GuardianRelation = (typeof GUARDIAN_RELATIONS)[keyof typeof GUARDIAN_RELATIONS];
export const guardianRelations = Object.values(GUARDIAN_RELATIONS) as [GuardianRelation, ...GuardianRelation[]];

export const PATIENT_TYPES = {
  NEW: "new",
  REPEAT: "repeat",
  REFERRED: "referred",
  CORPORATE: "corporate",
  GOVERNMENT: "government",
} as const;
export type PatientType = (typeof PATIENT_TYPES)[keyof typeof PATIENT_TYPES];
export const patientTypes = Object.values(PATIENT_TYPES) as [PatientType, ...PatientType[]];

export const VISIT_TYPES = {
  GENERAL: "general",
  EMERGENCY: "emergency",
  REVIEW: "review",
} as const;
export type VisitType = (typeof VISIT_TYPES)[keyof typeof VISIT_TYPES];
export const visitTypes = Object.values(VISIT_TYPES) as [VisitType, ...VisitType[]];

export const VISIT_STATUSES = {
  SCHEDULED: "scheduled",
  CHECKED_IN: "checked_in",
  NO_SHOW: "no_show",
  CANCELLED: "cancelled",
  COMPLETED: "completed",
} as const;
export type VisitStatus = (typeof VISIT_STATUSES)[keyof typeof VISIT_STATUSES];
export const visitStatuses = Object.values(VISIT_STATUSES) as [VisitStatus, ...VisitStatus[]];
