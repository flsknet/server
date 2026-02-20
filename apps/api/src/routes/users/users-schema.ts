import { user } from "@flsk/database";
import { z } from "@hono/zod-openapi";

import { schemaFactory } from "~/lib/schema-factory.js";

export const zUser = schemaFactory
  .createSelectSchema(user)
  .omit({
    email: true,
    emailVerified: true,
  })
  .openapi("User");

export const zGetUserParams = z.object({
  userId: z.string(),
});
