import Elysia from "elysia";
import { ip } from "elysia-ip";
import { intlify } from "./intlify";
import { jwtAccess, jwtRefresh } from "./jwt";
import { log } from "./logger";

export const ctx = new Elysia().use(log.into()).use(ip()).use(intlify).use(jwtAccess).use(jwtRefresh);
