import { z } from "zod";
import { getEmailSchema, getPasswordSchema, getStringSchema } from "./utils";

export const updateProfileSchema = z.object({
  name: getStringSchema(),
  email: getEmailSchema(),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: getStringSchema(),
  newPassword: getPasswordSchema(),
});

export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
