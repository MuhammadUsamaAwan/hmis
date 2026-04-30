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

function getShape(node: unknown): Record<string, unknown> | null {
  if (!node || typeof node !== "object") {
    return null;
  }
  if ("shape" in node) {
    return (node as ZodObject).shape as Record<string, unknown>;
  }
  if ("_def" in node) {
    const inner = (node as { _def: { innerType?: unknown } })._def.innerType;
    return inner && typeof inner === "object" && "shape" in inner
      ? ((inner as ZodObject).shape as Record<string, unknown>)
      : null;
  }
  return null;
}

export function isFieldRequired(schema: ZodObject, path: string) {
  let current: unknown = schema;

  for (const part of String(path).split(".")) {
    const shape = getShape(current);
    if (!shape) {
      return true;
    }
    current = shape[part];
  }

  if (!current || typeof current !== "object") {
    return true;
  }
  const field = current as { isOptional?: () => boolean; isNullable?: () => boolean };
  return !(field.isOptional?.() || field.isNullable?.());
}
