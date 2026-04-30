import { format, parseISO } from "date-fns";

type DateInput = string | Date | null | undefined;

function toDate(value: DateInput): Date | null {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  return parseISO(value);
}

export function formatDate(value: DateInput): string {
  const d = toDate(value);
  return d ? format(d, "PP") : "";
}

export function formatDateTime(value: DateInput): string {
  const d = toDate(value);
  return d ? format(d, "PPp") : "";
}

export function formatTime(value: DateInput): string {
  const d = toDate(value);
  return d ? format(d, "p") : "";
}
