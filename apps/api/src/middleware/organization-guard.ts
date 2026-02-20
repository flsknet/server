import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

import { getOrganizationMember, type organizationMember } from "@flsk/database";
import { db } from "~/lib/db";

declare module "hono" {
  interface ContextVariableMap {
    member: typeof organizationMember.$inferSelect;
  }
}

export const organizationGuard = () => {
  return createMiddleware(async (c, next) => {
    const user = c.get("user");

    const organizationId = c.req.param("organizationId");

    if (!organizationId) {
      throw new HTTPException(404);
    }

    const member = await getOrganizationMember(db, organizationId, user.id);

    if (!member) {
      throw new HTTPException(403);
    }

    c.set("member", member);

    await next();
  });
};
