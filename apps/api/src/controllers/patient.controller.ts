import { patientRegistrationSchema } from "@app/validations";
import { eq, or } from "drizzle-orm";
import Elysia from "elysia";
import { db } from "../db";
import { addressesTable, opdVisitsTable, patientsTable } from "../db/schema";
import { authGuard } from "../guards/auth-guard";
import { requirePermissions } from "../guards/permission-guard";
import { generateMrn, generateVisitNumber } from "../lib/mrn";
import { HttpError } from "../utils/error";

export const patientController = new Elysia({ prefix: "/patients" }).use(authGuard).post(
  "/register",
  async ({ body }) => {
    // Duplicate check on phone and CNIC
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
    beforeHandle: requirePermissions("Create Patient"),
    body: patientRegistrationSchema,
  }
);
