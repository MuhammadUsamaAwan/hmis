import Elysia from "elysia";
import { ip } from "elysia-ip";
import { intlify } from "./intlify";
import { log } from "./logger";

export const ctx = new Elysia().use(log.into()).use(ip()).use(intlify);
