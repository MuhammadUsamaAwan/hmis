import type { Redis } from "ioredis";
import type { AnyRoomKey, EventPayload, KeyToRoom, Room, RoomEvent } from "../events/registry";
import { log } from "./logger";
import type { WsHub } from "./ws-hub";

interface WsMessage {
  roomKey: string;
  event: string;
  data: unknown;
}

export class EventBus {
  private hub: WsHub;
  private pub: Redis;
  private sub: Redis;

  constructor(hub: WsHub, pub: Redis, sub: Redis) {
    this.hub = hub;
    this.pub = pub;
    this.sub = sub;
  }

  async emit<K extends AnyRoomKey, E extends RoomEvent<KeyToRoom<K>>>(
    roomKey: K,
    event: E,
    payload: EventPayload<KeyToRoom<K>, E>
  ): Promise<void> {
    const room: Room = roomKey.split(":")[0] as Room;
    const message: WsMessage = { roomKey, event: String(event), data: payload };
    await this.pub.publish(`ws:${room}`, JSON.stringify(message));
  }

  async connect(): Promise<void> {
    this.sub.on("pmessage", (_pattern: string, _channel: string, raw: string) => {
      let message: WsMessage;
      try {
        message = JSON.parse(raw) as WsMessage;
      } catch (err) {
        log.error(err, "[EventBus] Failed to parse message");
        return;
      }

      const { roomKey, event, data } = message;

      try {
        // data shape is validated at publish time — cast to bypass union narrowing
        (this.hub.emit as (r: string, e: string, d: unknown) => void)(roomKey, event, data);
      } catch (err) {
        log.error(err, `[EventBus] hub.emit threw for event "${event}" in room "${roomKey}"`);
      }
    });

    this.sub.on("error", err => log.error(err, "[EventBus] Subscriber error"));
    this.pub.on("error", err => log.error(err, "[EventBus] Publisher error"));

    await this.sub.psubscribe("ws:*");
    log.info("[EventBus] Subscribed to ws:*");
  }

  async disconnect(): Promise<void> {
    await Promise.all([this.pub.quit(), this.sub.quit()]);
  }
}
