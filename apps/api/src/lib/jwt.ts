import { jwt as elysiaJwt } from "@elysiajs/jwt";
import z from "zod";
import { env } from "../config/env";

const jwtPayloadSchema = z.object({
  sub: z.string(),
});

export type Claims = z.infer<typeof jwtPayloadSchema>;

export const jwtAccess = elysiaJwt({
  name: "jwtAccess",
  secret: env.JWT_ACCESS_SECRET,
  schema: jwtPayloadSchema,
  exp: "15m",
});

export const jwtRefresh = elysiaJwt({
  name: "jwtRefresh",
  secret: env.JWT_REFRESH_SECRET,
  schema: jwtPayloadSchema,
  exp: "15d",
});
