import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import { getUser } from "@flsk/database";
import { db } from "~/lib/db.js";

import { getUserRoute } from "./users-openapi.js";
import { zUser } from "./users-schema.js";

const router = new OpenAPIHono();

router.openapi(getUserRoute, async (c) => {
  const { userId } = c.req.valid("param");

  const user = await getUser(db, userId);

  if (!user) {
    throw new HTTPException(404);
  }

  return c.json(zUser.parse(user));
});

export { router as usersRouter };
