import { sql } from "drizzle-orm";
import type { db } from "../db";
import { countersTable } from "../db/schema";

type Tx = Parameters<Parameters<(typeof db)["transaction"]>[0]>[0];

async function nextCounter(tx: Tx, key: string): Promise<number> {
  const rows = await tx
    .insert(countersTable)
    .values({ key, value: 1 })
    .onConflictDoUpdate({
      target: countersTable.key,
      set: { value: sql`${countersTable.value} + 1` },
    })
    .returning({ value: countersTable.value });

  const row = rows[0];
  if (!row) {
    throw new Error(`Counter increment failed for key: ${key}`);
  }

  return row.value;
}

export async function generateMrn(tx: Tx): Promise<string> {
  const year = new Date().getFullYear();
  const n = await nextCounter(tx, `mrn_${year}`);
  return `MRN-${year}-${String(n).padStart(6, "0")}`;
}

export async function generateVisitNumber(tx: Tx): Promise<string> {
  const year = new Date().getFullYear();
  const n = await nextCounter(tx, `visit_${year}`);
  return `OPD-${year}-${String(n).padStart(6, "0")}`;
}
