import type { AnyFieldApi } from "@tanstack/react-form";
import type { ZodObject } from "zod";

export function getFieldProps(field: AnyFieldApi, schema: ZodObject) {
  return {
    id: field.name,
    name: field.name,
    value: field.state.value,
    onBlur: field.handleBlur,
    onValueChange: field.handleChange,
    isInvalid: field.state.meta.isTouched && !field.state.meta.isValid,
    errors: field.state.meta.errors,
    isRequired: isFieldRequired(schema, field.name),
  };
}

export function isFieldRequired(schema: ZodObject, path: string) {
  const field = schema.shape[path];
  return !(field?.isOptional?.() || field?.isNullable?.());
}
