import { type Elysia, ElysiaCustomStatusResponse } from "elysia";
import { env } from "../config/env";
import { HttpError } from "../utils/error";
import { ctx } from "./ctx";

export const errorHandler = (app: Elysia) =>
  app.use(ctx).onError(({ code, error, log, translate }) => {
    log?.error(error);

    switch (code) {
      case "INTERNAL_SERVER_ERROR":
        return {
          message: env.NODE_ENV === "development" ? error.message : translate("error.internal"),
        };

      default:
        if (error instanceof HttpError) {
          return { message: error.message, code: error.code };
        }
        if (error instanceof Error) {
          return { message: error.message };
        }
        if (error instanceof ElysiaCustomStatusResponse) {
          return { message: error.response.message };
        }
        return { message: translate("error.unknown") };
    }
  });
