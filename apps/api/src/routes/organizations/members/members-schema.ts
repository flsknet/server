import { organizationMember } from "@flsk/database";
import { z } from "@hono/zod-openapi";

import { schemaFactory } from "~/lib/schema-factory.js";

export const zOrganizationMember = schemaFactory
  .createSelectSchema(organizationMember)
  .omit({
    organizationId: true,
  })
  .openapi("OrganizationMember");

export const zGetOrganizationMemberParams = z.object({
  organizationId: z.string(),
  userId: z.string(),
});

export const zListOrganizationMembersParams = z.object({
  organizationId: z.string(),
});

export const zUpdateOrganizationMemberParams = z.object({
  organizationId: z.string(),
  userId: z.string(),
});

export const zUpdateOrganizationMemberBody = schemaFactory
  .createUpdateSchema(organizationMember)
  .pick({
    role: true,
  })
  .openapi("UpdateOrganizationMemberBody");

export const zDeleteOrganizationMemberParams = z.object({
  organizationId: z.string(),
  userId: z.string(),
});
