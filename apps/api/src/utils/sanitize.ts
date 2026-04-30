/**
 * Recursively converts empty strings to null in an object.
 * Useful for sanitizing form data before DB insert so optional
 * fields don't store "" instead of null.
 */
export function stripEmpty<T extends Record<string, unknown>>(obj: T): T {
  const result = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(obj)) {
    if (value === "") {
      result[key] = null;
    } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      result[key] = stripEmpty(value as Record<string, unknown>);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
