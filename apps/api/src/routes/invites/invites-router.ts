import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import {
  createOrganizationMember,
  deleteOrganizationInvite,
  findOrganizationInvite,
  getOrganization,
} from "@flsk/database";
import { db } from "~/lib/db";

import {
  acceptOrganizationInviteRoute,
  findOrganizationInviteRoute,
} from "./invites-openapi";
import { zOrganizationInvitePreview } from "./invites-schema";

const router = new OpenAPIHono();

router.openapi(findOrganizationInviteRoute, async (c) => {
  const { inviteId } = c.req.valid("param");

  const organizationInvite = await findOrganizationInvite(db, inviteId);

  if (!organizationInvite) {
    throw new HTTPException(404);
  }

  const organization = await getOrganization(
    db,
    organizationInvite.organizationId
  );

  return c.json(
    zOrganizationInvitePreview.parse({ ...organizationInvite, organization })
  );
});

router.openapi(acceptOrganizationInviteRoute, async (c) => {
  const user = c.get("user");
  const { inviteId } = c.req.valid("param");

  const organizationInvite = await findOrganizationInvite(db, inviteId);

  if (!organizationInvite) {
    throw new HTTPException(404);
  }

  if (
    organizationInvite.expiresAt &&
    new Date(organizationInvite.expiresAt).getTime() < new Date().getTime()
  ) {
    throw new HTTPException(404);
  }

  const organizationMember = await createOrganizationMember(
    db,
    organizationInvite.organizationId,
    { userId: user.id }
  );

  if (!organizationMember) {
    throw new HTTPException(500);
  }

  if (organizationInvite.singleUse) {
    await deleteOrganizationInvite(
      db,
      organizationInvite.organizationId,
      inviteId
    );
  }

  return c.body(null, 200);
});

export { router as invitesRouter };
