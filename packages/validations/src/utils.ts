import { parsePhoneNumberFromString } from "libphonenumber-js";
import z from "zod";

export const getStringSchema = ({ min = 1, max = 50 }: { min?: number; max?: number } = {}) =>
  z.string().trim().min(min).max(max);

export const getStringSchemaOptional = ({ min = 0, max = 50 }: { min?: number; max?: number } = {}) =>
  z.string().trim().min(min).max(max).optional();

export const getEmailSchema = () => z.email();

export const getEmailSchemaOptional = () =>
  z
    .string()
    .refine(val => val === "" || z.email().safeParse(val).success, {
      params: { i18nKey: "validation.invalidEmail" },
    })
    .optional();

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

export const getPhoneSchema = () =>
  z
    .string()
    .trim()
    .refine(val => parsePhoneNumberFromString(val)?.isValid(), {
      params: { i18nKey: "validation.invalidPhone" },
    });

export const getPhoneSchemaOptional = () =>
  z
    .string()
    .trim()
    .refine(val => val === "" || parsePhoneNumberFromString(val)?.isValid(), {
      params: { i18nKey: "validation.invalidPhone" },
    })
    .optional();

export const getCnicSchema = () =>
  z
    .string()
    .trim()
    .refine(val => /^[0-9]{13}$/.test(val), {
      params: { i18nKey: "validation.invalidCnic" },
    });

export const getCnicSchemaOptional = () =>
  z
    .string()
    .trim()
    .refine(val => val === "" || /^[0-9]{13}$/.test(val), {
      params: { i18nKey: "validation.invalidCnic" },
    })
    .optional();

export const getNumberSchema = ({
  min = -Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
}: {
  min?: number;
  max?: number;
} = {}) => z.number().min(min).max(max);

export const getIntegerSchema = ({
  min = -Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
}: {
  min?: number;
  max?: number;
} = {}) => z.number().int().min(min).max(max);

export const getDateSchema = ({ min, max }: { min?: string; max?: string } = {}) =>
  z.iso
    .datetime()
    .refine(val => !min || val >= min, { params: { i18nKey: "validation.dateTooEarly" } })
    .refine(val => !max || val <= max, { params: { i18nKey: "validation.dateTooLate" } });

export const getTimeSchema = () =>
  z
    .string()
    .trim()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/);

export const getDateSchemaOptional = ({ min, max }: { min?: string; max?: string } = {}) =>
  z
    .string()
    .refine(val => val === "" || z.iso.datetime().safeParse(val).success, {
      params: { i18nKey: "validation.invalidDate" },
    })
    .refine(val => val === "" || !min || val >= min, { params: { i18nKey: "validation.dateTooEarly" } })
    .refine(val => val === "" || !max || val <= max, { params: { i18nKey: "validation.dateTooLate" } })
    .optional();

export const getUuidSchema = () => z.uuid();

export const getUuidSchemaOptional = () =>
  z
    .string()
    .refine(val => val === "" || z.uuid().safeParse(val).success)
    .optional();

export const getEnumSchema = <T extends readonly [string, ...string[]]>(values: T) => z.enum(values);

export const getEnumSchemaOptional = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .string()
    .refine((val): val is T[number] => val === "" || (values as readonly string[]).includes(val))
    .optional();
