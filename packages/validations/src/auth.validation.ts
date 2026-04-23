import { z } from "zod";
import { getEmailSchema, getStringSchema } from "./utils";

export const signinSchema = z.object({
  email: getEmailSchema(),
  password: getStringSchema(),
});

export type SigninSchema = z.infer<typeof signinSchema>;
