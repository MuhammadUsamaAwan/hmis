import z from "zod";

export const getStringSchema = ({ min = 1, max = 50 }: { min?: number; max?: number } = {}) =>
  z.string().trim().min(min).max(max);

export const getStringSchemaOptional = ({ min = 0, max = 50 }: { min?: number; max?: number } = {}) =>
  z.string().trim().min(min).max(max).optional();

export const getPhoneSchema = () =>
  z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, { message: "Invalid phone number" });

export const getPhoneSchemaOptional = () =>
  z
    .string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, { message: "Invalid phone number" })
    .optional();

export const getCnicSchema = () =>
  z
    .string()
    .trim()
    .regex(/^[0-9]{13}$/, { message: "CNIC must be 13 digits without dashes" })
    .optional();

export const getEmailSchema = () => z.email();

export const getPasswordSchema = () =>
  z
    .string()
    .min(1)
    .min(8)
    .refine(val => /[a-z]/.test(val), { params: { i18nKey: "validation.password.lowercase" } })
    .refine(val => /[A-Z]/.test(val), { params: { i18nKey: "validation.password.uppercase" } })
    .refine(val => /[0-9]/.test(val), { params: { i18nKey: "validation.password.number" } })
    .refine(val => /[!@#$%^&*(),.?":{}|<>]/.test(val), {
      params: { i18nKey: "validation.password.specialChar" },
    });
