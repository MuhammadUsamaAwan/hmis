import { z } from "zod";
import { bloodGroups, genders, guardianRelations, maritalStatuses, patientTypes, visitTypes } from "./constants";
import {
  getCnicSchema,
  getDateSchema,
  getEmailSchemaOptional,
  getEnumSchema,
  getEnumSchemaOptional,
  getPhoneSchema,
  getPhoneSchemaOptional,
  getStringSchema,
  getStringSchemaOptional,
  getUuidSchema,
} from "./utils";

export const patientRegistrationSchema = z.object({
  // Demographics
  firstName: getStringSchema({ max: 100 }),
  middleName: getStringSchemaOptional({ max: 100 }),
  lastName: getStringSchema({ max: 100 }),
  guardianRelation: getEnumSchemaOptional(guardianRelations),
  guardianName: getStringSchemaOptional({ max: 100 }),
  gender: getEnumSchema(genders),
  dateOfBirth: getDateSchema({ max: new Date().toISOString() }),
  maritalStatus: getEnumSchemaOptional(maritalStatuses),
  bloodGroup: getEnumSchemaOptional(bloodGroups),
  occupation: getStringSchemaOptional({ max: 100 }),

  // Identification
  cnic: getCnicSchema(),

  // Contact
  phone: getPhoneSchema(),
  alternatePhone: getPhoneSchemaOptional(),
  email: getEmailSchemaOptional(),

  // Emergency contact
  emergencyContactName: getStringSchemaOptional({ max: 100 }),
  emergencyContactPhone: getPhoneSchemaOptional(),
  emergencyContactRelation: getStringSchemaOptional({ max: 50 }),

  // Address
  address: z
    .object({
      line1: getStringSchema({ max: 200 }),
      line2: getStringSchemaOptional({ max: 200 }),
      area: getStringSchemaOptional({ max: 100 }),
      tehsilId: getUuidSchema(),
      postalCode: getStringSchemaOptional({ max: 10 }),
    })
    .optional(),

  // Registration
  patientType: getEnumSchema(patientTypes).default("new"),
  visitType: getEnumSchema(visitTypes).default("general"),
});

export type PatientRegistrationSchema = z.infer<typeof patientRegistrationSchema>;

export const createVisitSchema = z.object({
  visitType: getEnumSchema(visitTypes).default("general"),
});

export type CreateVisitSchema = z.infer<typeof createVisitSchema>;
