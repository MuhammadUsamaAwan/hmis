import { queryKeys } from "@app/validations";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import type {
  AnyEventPayload,
  AnyIncomingEventPayload,
  AnyIncomingRoomEvent,
  AnyRoomEvent,
  AnyRoomMessage,
} from "@/api/events/registry";
import { getWsUrl } from "./eden";

type Handler<T> = (data: T) => void;

class WsClient {
  private ws: ReconnectingWebSocket | null = null;
  private handlers = new Map<string, Set<Handler<unknown>>>();

  private connect(): void {
    if (this.ws) {
      return;
    }

    this.ws = new ReconnectingWebSocket(getWsUrl);

    this.ws.addEventListener("message", ({ data: raw }) => {
      let message: AnyRoomMessage;
      try {
        message = JSON.parse(raw as string) as AnyRoomMessage;
      } catch {
        return;
      }

      if (!message || typeof message !== "object" || !("event" in message)) {
        return;
      }

      const subs = this.handlers.get(message.event);
      if (!subs) {
        return;
      }

      for (const handler of subs) {
        handler(message.data);
      }
    });
  }

  on<E extends AnyRoomEvent>(event: E, handler: Handler<AnyEventPayload<E>>): () => void {
    this.connect();

    let subs = this.handlers.get(event);
    if (subs === undefined) {
      subs = new Set();
      this.handlers.set(event, subs);
    }
    subs.add(handler as Handler<unknown>);

    return () => {
      this.handlers.get(event)?.delete(handler as Handler<unknown>);
    };
  }

  send<E extends AnyIncomingRoomEvent>(event: E, payload: AnyIncomingEventPayload<E>): void {
    this.connect();
    this.ws?.send(JSON.stringify({ event, data: payload }));
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
    this.handlers.clear();
  }
}

export const wsClient = new WsClient();

export const useInvalidationListener = () => {
  const queryClient = useQueryClient();
  useEffect(
    () =>
      wsClient.on("resource:invalidate", data => {
        for (const resource of data) {
          queryClient.invalidateQueries({ queryKey: queryKeys[resource].all });
        }
      }),
    [queryClient]
  );
};
