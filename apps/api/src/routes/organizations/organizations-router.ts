import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import {
  createOrganization,
  createOrganizationMember,
  deleteOrganization,
  getOrganization,
  listOrganizations,
  updateOrganisaton,
} from "@flsk/database";
import { db } from "~/lib/db.js";

import { organizationGuard } from "~/middleware/organization-guard.js";

import { boardsRouter } from "./boards/boards-router.js";
import { discussionsRouter } from "./discussions/discussions-router.js";
import { invitesRouter } from "./invites/invites-router.js";
import { membersRouter } from "./members/members-router.js";

import {
  createOrganizationRoute,
  deleteOrganizationRoute,
  getOrganizationRoute,
  listOrganizationsRoute,
  updateOrganizationRoute,
} from "./organizations-openapi.js";
import { zOrganization } from "./organizations-schema.js";

export const router = new OpenAPIHono();

router.route(
  "/:organizationId",
  new OpenAPIHono()
    .use(organizationGuard())
    .route("/boards", boardsRouter)
    .route("/discussions", discussionsRouter)
    .route("/invites", invitesRouter)
    .route("/members", membersRouter)
);

router.openapi(listOrganizationsRoute, async (c) => {
  const user = c.get("user");

  const organizations = await listOrganizations(db, user.id);

  return c.json(zOrganization.array().parse(organizations));
});

router.openapi(getOrganizationRoute, async (c) => {
  const { organizationId } = c.req.valid("param");

  const organization = await getOrganization(db, organizationId);

  if (!organization) {
    throw new HTTPException(404);
  }

  return c.json(zOrganization.parse(organization));
});

router.openapi(createOrganizationRoute, async (c) => {
  const user = c.get("user");
  const body = c.req.valid("json");

  const organization = await createOrganization(db, body);

  if (!organization) {
    throw new HTTPException(500);
  }

  const organizationMember = await createOrganizationMember(
    db,
    organization.id,
    {
      userId: user.id,
      role: "owner",
    }
  );

  if (!organizationMember) {
    throw new HTTPException(500);
  }

  return c.json(zOrganization.parse(organization), 201);
});

router.openapi(updateOrganizationRoute, async (c) => {
  const member = c.get("member");

  const { organizationId } = c.req.valid("param");
  const body = c.req.valid("json");

  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  await updateOrganisaton(db, organizationId, body);

  return c.body(null, 200);
});

router.openapi(deleteOrganizationRoute, async (c) => {
  const member = c.get("member");

  const { organizationId } = c.req.valid("param");

  if (member.role != "owner") {
    throw new HTTPException(403);
  }

  await deleteOrganization(db, organizationId);

  return c.body(null, 204);
});

export { router as organizationsRouter };
