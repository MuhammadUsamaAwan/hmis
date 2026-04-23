import type { Resource } from "@app/validations";

export interface EventRegistry {
  global: {
    emit: {
      "resource:invalidate": Resource[];
    };
    on: {
      ping: Record<string, never>;
    };
  };
}

export type Room = keyof EventRegistry;
export type RoomKey<R extends Room> = R extends "global" ? "global" : never;
export type AnyRoomKey = RoomKey<Room>;
export type KeyToRoom<K extends AnyRoomKey> = K extends "global" ? "global" : never;

export type RoomEvent<R extends Room> = keyof EventRegistry[R]["emit"];
export type EventPayload<R extends Room, E extends RoomEvent<R>> = EventRegistry[R]["emit"][E];

export type IncomingRoomEvent<R extends Room> = keyof EventRegistry[R]["on"];
export type IncomingEventPayload<R extends Room, E extends IncomingRoomEvent<R>> = EventRegistry[R]["on"][E];

// Flat client-facing types
export type AnyRoomEvent = { [R in Room]: RoomEvent<R> }[Room];
export type AnyEventPayload<E extends AnyRoomEvent> = {
  [R in Room]: E extends RoomEvent<R> ? EventPayload<R, E> : never;
}[Room];
export type AnyRoomMessage = { [E in AnyRoomEvent]: { event: E; data: AnyEventPayload<E> } }[AnyRoomEvent];

export type AnyIncomingRoomEvent = { [R in Room]: IncomingRoomEvent<R> }[Room];
export type AnyIncomingEventPayload<E extends AnyIncomingRoomEvent> = {
  [R in Room]: E extends IncomingRoomEvent<R> ? IncomingEventPayload<R, E> : never;
}[Room];
