import { createRoute } from "@hono/zod-openapi";

import { zGetUserParams, zUser } from "./users-schema.js";

export const getUserRoute = createRoute({
  method: "get",
  path: "/{userId}",
  operationId: "getUser",
  summary: "Get user",
  description: "Retrieve a user.",
  tags: ["users"],
  request: {
    params: zGetUserParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zUser },
      },
    },
  },
});
