import type { Session, User } from "better-auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import { auth } from "~/lib/auth";

declare module "hono" {
  interface ContextVariableMap {
    user: User;
    session: Session;
  }
}

export const withAuth = () => {
  return createMiddleware(async (c, next) => {
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    if (!session) {
      throw new HTTPException(401);
    }

    c.set("session", session.session);
    c.set("user", session.user);

    await next();
  });
};
