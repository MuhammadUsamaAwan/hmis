import { db } from "../db";
import { auditLogTable } from "../db/schema";
import { jobSystem } from "../lib/queue";

export const auditProducer = jobSystem.createProducer("logAudit");

export function registerWorkers(): void {
  jobSystem.createWorker("logAudit", async data => {
    await db.insert(auditLogTable).values(data);
  });
}
