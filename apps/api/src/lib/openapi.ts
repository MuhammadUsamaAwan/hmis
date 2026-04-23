import { openapi } from "@elysiajs/openapi";
import packageJSON from "../../package.json";

export const openapiOptions = openapi({
  documentation: {
    info: {
      title: "HMIS",
      version: packageJSON.version,
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
});
