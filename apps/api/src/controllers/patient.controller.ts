import { createVisitSchema, PERMISSIONS, patientRegistrationSchema } from "@app/validations";
import { eq, ilike, isNull, or } from "drizzle-orm";
import Elysia from "elysia";
import { z } from "zod";
import { db } from "../db";
import { addressesTable, opdVisitsTable, patientsTable } from "../db/schema";
import { authGuard } from "../guards/auth-guard";
import { requirePermissions } from "../guards/permission-guard";
import { generateMrn, generateVisitNumber } from "../lib/mrn";
import { HttpError } from "../utils/error";

export const patientController = new Elysia({ prefix: "/patients" })
  .use(authGuard)
  .get(
    "/search",
    async ({ query }) => {
      const q = `%${query.q}%`;

      return db
        .select({
          id: patientsTable.id,
          mrn: patientsTable.mrn,
          firstName: patientsTable.firstName,
          middleName: patientsTable.middleName,
          lastName: patientsTable.lastName,
          gender: patientsTable.gender,
          dateOfBirth: patientsTable.dateOfBirth,
          phone: patientsTable.phone,
          cnic: patientsTable.cnic,
          patientType: patientsTable.patientType,
        })
        .from(patientsTable)
        .where(
          or(
            ilike(patientsTable.mrn, q),
            ilike(patientsTable.phone, q),
            ilike(patientsTable.cnic, q),
            ilike(patientsTable.firstName, q),
            ilike(patientsTable.lastName, q)
          ) && isNull(patientsTable.deletedAt)
        )
        .limit(20);
    },
    {
      beforeHandle: requirePermissions(PERMISSIONS.VIEW_PATIENTS),
      query: z.object({ q: z.string().min(1) }),
    }
  )
  .post(
    "/register",
    async ({ body }) => {
      const conditions = [eq(patientsTable.phone, body.phone)];
      if (body.cnic) {
        conditions.push(eq(patientsTable.cnic, body.cnic));
      }

      const [existing] = await db
        .select({ id: patientsTable.id })
        .from(patientsTable)
        .where(or(...conditions))
        .limit(1);

      if (existing) {
        throw new HttpError(409, "A patient with the same phone or CNIC already exists");
      }

      return db.transaction(async tx => {
        let addressId: string | undefined;
        if (body.address) {
          const [address] = await tx.insert(addressesTable).values(body.address).returning({ id: addressesTable.id });

          if (!address) {
            throw new HttpError(500, "Failed to create address");
          }
          addressId = address.id;
        }

        const mrn = await generateMrn(tx);

        const [patient] = await tx
          .insert(patientsTable)
          .values({
            mrn,
            firstName: body.firstName,
            middleName: body.middleName,
            lastName: body.lastName,
            guardianRelation: body.guardianRelation,
            guardianName: body.guardianName,
            gender: body.gender,
            dateOfBirth: body.dateOfBirth,
            maritalStatus: body.maritalStatus,
            bloodGroup: body.bloodGroup,
            occupation: body.occupation,
            cnic: body.cnic,
            phone: body.phone,
            alternatePhone: body.alternatePhone,
            email: body.email,
            emergencyContactName: body.emergencyContactName,
            emergencyContactPhone: body.emergencyContactPhone,
            emergencyContactRelation: body.emergencyContactRelation,
            addressId,
            patientType: body.patientType,
          })
          .returning();

        if (!patient) {
          throw new HttpError(500, "Failed to create patient");
        }

        const visitNumber = await generateVisitNumber(tx);

        const [visit] = await tx
          .insert(opdVisitsTable)
          .values({
            visitNumber,
            patientId: patient.id,
            visitType: body.visitType,
          })
          .returning();

        return { patient, visit };
      });
    },
    {
      beforeHandle: requirePermissions(PERMISSIONS.CREATE_PATIENT),
      body: patientRegistrationSchema,
    }
  )
  .post(
    "/:id/visits",
    async ({ params, body }) => {
      const [patient] = await db
        .select({ id: patientsTable.id })
        .from(patientsTable)
        .where(eq(patientsTable.id, params.id) && isNull(patientsTable.deletedAt))
        .limit(1);

      if (!patient) {
        throw new HttpError(404, "Patient not found");
      }

      const visit = await db.transaction(async tx => {
        const visitNumber = await generateVisitNumber(tx);
        const [row] = await tx
          .insert(opdVisitsTable)
          .values({
            visitNumber,
            patientId: patient.id,
            visitType: body.visitType,
          })
          .returning();
        return row;
      });

      return { visit };
    },
    {
      beforeHandle: requirePermissions(PERMISSIONS.CREATE_PATIENT),
      body: createVisitSchema,
      params: z.object({ id: z.string().uuid() }),
    }
  );
