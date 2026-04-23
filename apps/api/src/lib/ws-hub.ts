import type {
  AnyRoomKey,
  EventPayload,
  IncomingEventPayload,
  IncomingRoomEvent,
  KeyToRoom,
  Room,
  RoomEvent,
  RoomKey,
} from "../events/registry";
import { log } from "./logger";

export interface Ws {
  send: (data: unknown) => unknown;
  raw: object;
}

type IncomingHandler = (ws: Ws, roomKey: string, payload: unknown) => void;

export class WsHub {
  private rooms = new Map<string, Set<Ws>>();
  private handlers = new Map<string, Set<IncomingHandler>>();

  join<K extends AnyRoomKey>(roomKey: K, ws: Ws): void {
    let room = this.rooms.get(roomKey);
    if (room === undefined) {
      room = new Set();
      this.rooms.set(roomKey, room);
    }
    room.add(ws);
  }

  leave<K extends AnyRoomKey>(roomKey: K, ws: Ws): void {
    const room = this.rooms.get(roomKey);
    if (room === undefined) {
      return;
    }

    room.delete(ws);
    if (room.size === 0) {
      this.rooms.delete(roomKey);
    }
  }

  emit<K extends AnyRoomKey, E extends RoomEvent<KeyToRoom<K>>>(
    roomKey: K,
    event: E,
    payload: EventPayload<KeyToRoom<K>, E>
  ): void {
    const room = this.rooms.get(roomKey);
    if (room === undefined || room.size === 0) {
      return;
    }

    const message = JSON.stringify({ event, data: payload });
    for (const ws of room) {
      try {
        ws.send(message);
      } catch (err) {
        log.error(err, `[WsHub] Failed to send to ws in room "${roomKey}"`);
        room.delete(ws);
      }
    }
  }

  broadcast<K extends AnyRoomKey, E extends RoomEvent<KeyToRoom<K>>>(
    sender: Ws,
    roomKey: K,
    event: E,
    payload: EventPayload<KeyToRoom<K>, E>
  ): void {
    const room = this.rooms.get(roomKey);
    if (room === undefined || room.size === 0) {
      return;
    }

    const message = JSON.stringify({ event, data: payload });
    for (const ws of room) {
      if (ws.raw === sender.raw) {
        continue;
      }
      try {
        ws.send(message);
      } catch (err) {
        log.error(err, `[WsHub] Failed to broadcast to ws in room "${roomKey}"`);
        room.delete(ws);
      }
    }
  }

  on<R extends Room, E extends IncomingRoomEvent<R>>(
    room: R,
    event: E,
    handler: (ws: Ws, roomKey: RoomKey<R>, payload: IncomingEventPayload<R, E>) => void
  ): () => void {
    const key = `${room}:${String(event)}`;

    if (!this.handlers.has(key)) {
      this.handlers.set(key, new Set());
    }
    // biome-ignore lint/style/noNonNullAssertion: guaranteed by the block above
    this.handlers.get(key)!.add(handler as IncomingHandler);

    return () => {
      this.handlers.get(key)?.delete(handler as IncomingHandler);
    };
  }

  dispatch(ws: Ws, roomKey: AnyRoomKey, data: unknown): void {
    let parsed: unknown;
    try {
      parsed = typeof data === "string" ? JSON.parse(data) : data;
    } catch {
      return;
    }
    if (!parsed || typeof parsed !== "object" || !("event" in parsed)) {
      return;
    }

    const { event, data: payload } = parsed as { event: string; data: unknown };
    const room = roomKey.split(":")[0];
    const key = `${room}:${event}`;
    const subs = this.handlers.get(key);
    if (subs === undefined || subs.size === 0) {
      return;
    }

    for (const handler of subs) {
      try {
        handler(ws, roomKey, payload);
      } catch (err) {
        log.error(err, `[WsHub] Handler threw for event "${event}" in room "${roomKey}"`);
      }
    }
  }
}
