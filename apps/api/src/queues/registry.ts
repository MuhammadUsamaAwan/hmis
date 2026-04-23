import z from "zod";
import { actions, auditedTables } from "../db/schema";

export const jobRegistry = z.discriminatedUnion("name", [
  z.object({
    name: z.literal("logAudit"),
    data: z.object({
      userId: z.uuid(),
      tableName: z.enum(auditedTables),
      rowId: z.string().nonempty(),
      action: z.enum(actions),
      oldData: z.unknown().optional(),
      newData: z.unknown().optional(),
      clientInfo: z.unknown().optional(),
    }),
  }),
  z.object({
    name: z.literal("signin"),
    data: z.object({
      userId: z.uuid(),
      jti: z.uuid(),
      clientInfo: z.unknown().optional(),
    }),
  }),
]);

export type Job = z.infer<typeof jobRegistry>;
export type JobName = Job["name"];
export type JobData<T extends Job["name"]> = Extract<Job, { name: T }>["data"];
