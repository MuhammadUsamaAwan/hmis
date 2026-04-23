import Elysia from "elysia";
import { hub } from "../events";

export const wsController = new Elysia().ws("/ws", {
  open(ws) {
    hub.join("global", ws);
  },
  close(ws) {
    hub.leave("global", ws);
  },
  message(ws, message) {
    hub.dispatch(ws, "global", message);
  },
});
