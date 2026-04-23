import { db } from "../db";
import { auditLogTable, signinsTable } from "../db/schema";
import { jobSystem } from "../lib/queue";

export const auditProducer = jobSystem.createProducer("logAudit");
export const signinProducer = jobSystem.createProducer("signin");

export function registerWorkers(): void {
  jobSystem.createWorker("logAudit", async data => {
    await db.insert(auditLogTable).values(data);
  });
  jobSystem.createWorker("signin", async data => {
    await db.insert(signinsTable).values(data);
  });
}
