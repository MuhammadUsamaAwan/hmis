import { z } from "zod";
import { bloodGroups, genders, guardianRelations, maritalStatuses, patientTypes, visitTypes } from "./constants";
import {
  getCnicSchema,
  getEmailSchema,
  getPhoneSchema,
  getPhoneSchemaOptional,
  getStringSchema,
  getStringSchemaOptional,
} from "./utils";

export const patientRegistrationSchema = z.object({
  // Demographics
  firstName: getStringSchema({ max: 100 }),
  middleName: getStringSchemaOptional({ max: 100 }),
  lastName: getStringSchema({ max: 100 }),
  guardianRelation: z.enum(guardianRelations).optional(),
  guardianName: getStringSchemaOptional({ max: 100 }),
  gender: z.enum(genders),
  dateOfBirth: z.string().date(),
  maritalStatus: z.enum(maritalStatuses).optional(),
  bloodGroup: z.enum(bloodGroups).optional(),
  occupation: getStringSchemaOptional({ max: 100 }),

  // Identification
  cnic: getCnicSchema(),

  // Contact
  phone: getPhoneSchema(),
  alternatePhone: getPhoneSchemaOptional(),
  email: getEmailSchema().optional(),

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
      tehsilId: z.uuid(),
      postalCode: getStringSchemaOptional({ max: 10 }),
    })
    .optional(),

  // Registration
  patientType: z.enum(patientTypes).default("new"),
  visitType: z.enum(visitTypes).default("general"),
});

export type PatientRegistrationSchema = z.infer<typeof patientRegistrationSchema>;

export const createVisitSchema = z.object({
  visitType: z.enum(visitTypes).default("general"),
});

export type CreateVisitSchema = z.infer<typeof createVisitSchema>;
