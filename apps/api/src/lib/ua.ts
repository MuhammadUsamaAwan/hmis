import { UAParser } from "ua-parser-js";

export function parseUA(userAgent: string | undefined, ip?: string) {
  const parser = new UAParser(userAgent);
  const { os, browser, device } = parser.getResult();

  return { os, browser, device, ip };
}

export type ClientInfo = ReturnType<typeof parseUA>;
