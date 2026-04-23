import { Elysia } from "elysia";
import { helmet } from "elysia-helmet";
import { env } from "./config/env";
import { authController } from "./controllers/auth.controller";
import { userController } from "./controllers/user.controller";
import { wsController } from "./controllers/ws.controller";
import { ctx } from "./lib/ctx";
import { errorHandler } from "./lib/error-handler";
import { openapiOptions } from "./lib/openapi";
import { rateLimitMiddleware } from "./middleware/rate-limit";
import { throttleMiddleware } from "./middleware/throttle";

export function createApp() {
  return new Elysia()
    .use(env.NODE_ENV === "production" && helmet())
    .use(openapiOptions)
    .use(throttleMiddleware)
    .use(rateLimitMiddleware())
    .use(ctx)
    .use(errorHandler)
    .use(authController)
    .use(userController)
    .use(wsController);
}

export type App = ReturnType<typeof createApp>;
