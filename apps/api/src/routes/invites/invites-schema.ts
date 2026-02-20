import { organization, organizationInvite } from "@flsk/database";
import { z } from "@hono/zod-openapi";

import { schemaFactory } from "~/lib/schema-factory.js";

export const zOrganizationInvitePreview = schemaFactory
  .createSelectSchema(organizationInvite)
  .extend({
    organization: schemaFactory.createSelectSchema(organization),
  })
  .openapi("OrganizationInvitePreview");

export const zFindOrganizationInviteParams = z.object({
  inviteId: z.string(),
});

export const zAcceptOrganizationInviteParams = z.object({
  inviteId: z.string(),
});
