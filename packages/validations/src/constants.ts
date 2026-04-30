export const PERMISSIONS = {
  CREATE_PATIENT: "Create Patient",
  VIEW_PATIENTS: "View Patients",
  UPDATE_PATIENT: "Update Patient",
} as const;
export const permissions = Object.values(PERMISSIONS) as [Permission, ...Permission[]];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ACTIONS = {
  VIEW: "View",
  CREATE: "Create",
  UPDATE: "Update",
  DELETE: "Delete",
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
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
} as const;
export type Gender = (typeof GENDERS)[keyof typeof GENDERS];
export const genders = Object.values(GENDERS) as [Gender, ...Gender[]];

export const MARITAL_STATUSES = {
  SINGLE: "Single",
  MARRIED: "Married",
  DIVORCED: "Divorced",
  WIDOWED: "Widowed",
  SEPARATED: "Separated",
} as const;
export type MaritalStatus = (typeof MARITAL_STATUSES)[keyof typeof MARITAL_STATUSES];
export const maritalStatuses = Object.values(MARITAL_STATUSES) as [MaritalStatus, ...MaritalStatus[]];

export const GUARDIAN_RELATIONS = {
  SON_OF: "Son of",
  DAUGHTER_OF: "Daughter of",
  WIFE_OF: "Wife of",
} as const;
export type GuardianRelation = (typeof GUARDIAN_RELATIONS)[keyof typeof GUARDIAN_RELATIONS];
export const guardianRelations = Object.values(GUARDIAN_RELATIONS) as [GuardianRelation, ...GuardianRelation[]];

export const PATIENT_TYPES = {
  NEW: "New",
  REPEAT: "Repeat",
  REFERRED: "Referred",
  CORPORATE: "Corporate",
  GOVERNMENT: "Government",
} as const;
export type PatientType = (typeof PATIENT_TYPES)[keyof typeof PATIENT_TYPES];
export const patientTypes = Object.values(PATIENT_TYPES) as [PatientType, ...PatientType[]];

export const VISIT_TYPES = {
  GENERAL: "General",
  EMERGENCY: "Emergency",
  REVIEW: "Review",
} as const;
export type VisitType = (typeof VISIT_TYPES)[keyof typeof VISIT_TYPES];
export const visitTypes = Object.values(VISIT_TYPES) as [VisitType, ...VisitType[]];

export const VISIT_STATUSES = {
  SCHEDULED: "Scheduled",
  CHECKED_IN: "Checked In",
  NO_SHOW: "No Show",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
} as const;
export type VisitStatus = (typeof VISIT_STATUSES)[keyof typeof VISIT_STATUSES];
export const visitStatuses = Object.values(VISIT_STATUSES) as [VisitStatus, ...VisitStatus[]];
