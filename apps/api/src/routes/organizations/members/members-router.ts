import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import {
  deleteOrganizationMember,
  getOrganizationMember,
  listOrganizationMembers,
  updateOrganizationMember,
} from "@flsk/database";
import { db } from "~/lib/db.js";

import {
  deleteOrganizationMemberRoute,
  getOrganizationMemberRoute,
  listOrganizationMembersRoute,
  updateOrganizationMemberRoute,
} from "./members-openapi.js";
import { zOrganizationMember } from "./members-schema.js";

const router = new OpenAPIHono();

router.openapi(listOrganizationMembersRoute, async (c) => {
  const { organizationId } = c.req.valid("param");

  const organizationMembers = await listOrganizationMembers(db, organizationId);

  return c.json(zOrganizationMember.array().parse(organizationMembers));
});

router.openapi(getOrganizationMemberRoute, async (c) => {
  const { organizationId, userId } = c.req.valid("param");

  const organizationMember = await getOrganizationMember(
    db,
    organizationId,
    userId
  );

  if (!organizationMember) {
    throw new HTTPException(404);
  }

  return c.json(zOrganizationMember.parse(organizationMember));
});

router.openapi(updateOrganizationMemberRoute, async (c) => {
  const member = c.get("member");

  const { organizationId, userId } = c.req.valid("param");
  const body = c.req.valid("json");

  // Only the owner of the organization can change member roles.
  if (member.role != "owner") {
    throw new HTTPException(403);
  }

  const organizationMember = await getOrganizationMember(
    db,
    organizationId,
    userId
  );

  if (!organizationMember) {
    throw new HTTPException(404);
  }

  // The owner can't modify their own role.
  if (organizationMember.role == "owner") {
    throw new HTTPException(403);
  }

  await updateOrganizationMember(db, organizationId, userId, body);

  // Giving another member the owner role takes it away from the current owner.
  if (body.role == "owner") {
    await updateOrganizationMember(db, organizationId, member.userId, {
      role: "member",
    });
  }

  return c.body(null, 200);
});

router.openapi(deleteOrganizationMemberRoute, async (c) => {
  const member = c.get("member");

  const { organizationId, userId } = c.req.valid("param");

  const organizationMember = await getOrganizationMember(
    db,
    organizationId,
    userId
  );

  if (!organizationMember) {
    throw new HTTPException(404);
  }

  // Allow non-owners to leave an organization.
  if (organizationMember.userId == member.userId && member.role != "owner") {
    await deleteOrganizationMember(db, organizationId, userId);

    return c.body(null, 204);
  }

  // Allow kicking other members.
  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  // The owner can't be kicked.
  if (organizationMember.role == "owner") {
    throw new HTTPException(403);
  }

  await deleteOrganizationMember(db, organizationId, userId);

  return c.body(null, 204);
});

export { router as membersRouter };
