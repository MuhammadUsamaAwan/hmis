import { randomUUID } from "node:crypto";

export async function hashPassword(data: string): Promise<string> {
  return Bun.password.hash(data);
}

export async function verifyPassword(data: string, hash: string): Promise<boolean> {
  return Bun.password.verify(data, hash);
}

export function generateUUID(): string {
  return randomUUID();
}
