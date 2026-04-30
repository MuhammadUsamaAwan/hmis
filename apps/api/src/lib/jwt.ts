import { jwt as elysiaJwt } from "@elysiajs/jwt";
import z from "zod";
import { env } from "../config/env";
import { redisClient } from "./redis";
import type { ClientInfo } from "./ua";

const jwtPayloadSchema = z.object({
  jti: z.string(),
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
  exp: "14d",
});

type JtiPayload = Claims & ClientInfo;

const SESSION_TTL = 14 * 24 * 60 * 60; // 14 days in seconds

function userSessionsKey(userId: string) {
  return `user:${userId}:sessions`;
}

export async function setJti(jti: string, payload: JtiPayload): Promise<void> {
  const redis = redisClient.get();
  await Promise.all([
    redis.set(
      jti,
      JSON.stringify({
        ...payload,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + SESSION_TTL * 1000).toISOString(),
      }),
      "EX",
      SESSION_TTL
    ),
    redis.sadd(userSessionsKey(payload.sub), jti),
  ]);
}

export async function isJtiRevoked(jti: string): Promise<boolean> {
  const redis = redisClient.get();
  return !(await redis.exists(jti));
}

export async function consumeJti(jti: string): Promise<boolean> {
  const redis = redisClient.get();
  const data = await redis.get(jti);
  if (!data) {
    return false;
  }
  const parsed = JSON.parse(data) as JtiPayload;
  await Promise.all([redis.del(jti), redis.srem(userSessionsKey(parsed.sub), jti)]);
  return true;
}

export async function revokeAllUserSessions(userId: string): Promise<void> {
  const redis = redisClient.get();
  const key = userSessionsKey(userId);
  const jtis = await redis.smembers(key);
  if (jtis.length > 0) {
    await redis.del(...jtis, key);
  } else {
    await redis.del(key);
  }
}

export async function getJtiData(jti: string) {
  const redis = redisClient.get();
  const data = await redis.get(jti);
  if (!data) {
    return null;
  }
  return JSON.parse(data) as JtiPayload & {
    createdAt: string;
    expiresAt: string;
  };
}
