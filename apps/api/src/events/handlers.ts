import { hub } from ".";

export function registerWsHandlers(): void {
  hub.on("global", "ping", (_ws, _roomKey, _payload) => console.log("Ping Received"));
}
