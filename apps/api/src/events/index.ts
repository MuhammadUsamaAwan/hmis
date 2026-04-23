import { EventBus } from "../lib/event-bus";
import { createRedisClient } from "../lib/redis";
import { WsHub } from "../lib/ws-hub";

export const hub = new WsHub();
export const bus = new EventBus(hub, createRedisClient(), createRedisClient());
