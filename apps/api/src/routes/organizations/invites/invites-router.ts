import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import {
  createOrganizationInvite,
  deleteOrganizationInvite,
  getOrganizationInvite,
  listOrganizationInvites,
  updateOrganizationInvite,
} from "@flsk/database";
import { db } from "~/lib/db";

import {
  createOrganizationInviteRoute,
  deleteOrganizationInviteRoute,
  getOrganizationInviteRoute,
  listOrganizationInvitesRoute,
  updateOrganizationInviteRoute,
} from "./invites-openapi";
import { zOrganizationInvite } from "./invites-schema";

const router = new OpenAPIHono();

router.openapi(listOrganizationInvitesRoute, async (c) => {
  const { organizationId } = c.req.valid("param");

  const organizationInvites = await listOrganizationInvites(db, organizationId);

  return c.json(zOrganizationInvite.array().parse(organizationInvites));
});

router.openapi(getOrganizationInviteRoute, async (c) => {
  const { organizationId, inviteId } = c.req.valid("param");

  const organizationInvite = await getOrganizationInvite(
    db,
    organizationId,
    inviteId
  );

  if (!organizationInvite) {
    throw new HTTPException(404);
  }

  return c.json(zOrganizationInvite.parse(organizationInvite));
});

router.openapi(createOrganizationInviteRoute, async (c) => {
  const user = c.get("user");
  const member = c.get("member");

  const { organizationId } = c.req.valid("param");
  const body = c.req.valid("json");

  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  const organizationInvite = await createOrganizationInvite(
    db,
    organizationId,
    {
      ...body,
      createdBy: user.id,
    }
  );

  if (!organizationInvite) {
    throw new HTTPException(500);
  }

  return c.json(zOrganizationInvite.parse(organizationInvite), 201);
});

router.openapi(updateOrganizationInviteRoute, async (c) => {
  const member = c.get("member");

  const { organizationId, inviteId } = c.req.valid("param");
  const body = c.req.valid("json");

  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  const organizationInvite = await getOrganizationInvite(
    db,
    organizationId,
    inviteId
  );

  if (!organizationInvite) {
    throw new HTTPException(404);
  }

  await updateOrganizationInvite(db, organizationId, inviteId, body);

  return c.body(null, 200);
});

router.openapi(deleteOrganizationInviteRoute, async (c) => {
  const member = c.get("member");

  const { organizationId, inviteId } = c.req.valid("param");

  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  const organizationInvite = await getOrganizationInvite(
    db,
    organizationId,
    inviteId
  );

  if (!organizationInvite) {
    throw new HTTPException(404);
  }

  await deleteOrganizationInvite(db, organizationId, inviteId);

  return c.body(null, 204);
});

export { router as invitesRouter };
