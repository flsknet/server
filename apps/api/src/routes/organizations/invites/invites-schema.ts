import { organizationInvite } from "@flsk/database";
import { z } from "@hono/zod-openapi";

import { schemaFactory } from "~/lib/schema-factory.js";

export const zOrganizationInvite = schemaFactory
  .createSelectSchema(organizationInvite)
  .omit({
    organizationId: true,
  })
  .openapi("OrganizationInvite");

export const zGetOrganizationInviteParams = z.object({
  organizationId: z.string(),
  inviteId: z.string(),
});

export const zListOrganizationInvitesParams = z.object({
  organizationId: z.string(),
});

export const zCreateOrganizationInviteParams = z.object({
  organizationId: z.string(),
});

export const zCreateOrganizationInviteBody = schemaFactory
  .createInsertSchema(organizationInvite)
  .pick({
    singleUse: true,
    expiresAt: true,
  })
  .openapi("CreateOrganizationInviteBody");

export const zUpdateOrganizationInviteParams = z.object({
  organizationId: z.string(),
  inviteId: z.string(),
});

export const zUpdateOrganizationInviteBody = schemaFactory
  .createUpdateSchema(organizationInvite)
  .pick({
    singleUse: true,
    expiresAt: true,
  })
  .openapi("UpdateOrganizationInviteBody");

export const zDeleteOrganizationInviteParams = z.object({
  organizationId: z.string(),
  inviteId: z.string(),
});
