import Elysia from "elysia";
import { hub } from "../events";
import { authGuard } from "../guards/auth-guard";

export const wsController = new Elysia().use(authGuard).ws("/ws", {
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
