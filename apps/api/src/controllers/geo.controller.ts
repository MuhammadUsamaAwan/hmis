import { eq } from "drizzle-orm";
import Elysia from "elysia";
import { db } from "../db";
import { districtsTable, tehsilsTable } from "../db/schema";
import { authGuard } from "../guards/auth-guard";

export const geoController = new Elysia({ prefix: "/geo" }).use(authGuard).get("/tehsils", async () =>
  db
    .select({
      id: tehsilsTable.id,
      name: tehsilsTable.name,
      district: districtsTable.name,
    })
    .from(tehsilsTable)
    .innerJoin(districtsTable, eq(tehsilsTable.districtId, districtsTable.id))
);
