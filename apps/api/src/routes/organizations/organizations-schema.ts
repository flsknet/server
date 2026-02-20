import { organization } from "@flsk/database";
import { z } from "@hono/zod-openapi";

import { schemaFactory } from "~/lib/schema-factory.js";

export const zOrganization = schemaFactory
  .createSelectSchema(organization)
  .extend({
    memberCount: z.number(),
    discussionCount: z.number(),
    boardCount: z.number(),
  })
  .openapi("Organization");

export const zGetOrganizationParams = z.object({
  organizationId: z.string(),
});

export const zCreateOrganizationBody = schemaFactory
  .createInsertSchema(organization, {
    name: (schema) => schema.min(4).max(30),
  })
  .pick({
    name: true,
    description: true,
    image: true,
    readme: true,
  })
  .openapi("CreateOrganizationBody");

export const zUpdateOrganizationParams = z.object({
  organizationId: z.string(),
});

export const zUpdateOrganizationBody = schemaFactory
  .createUpdateSchema(organization, {
    name: (schema) => schema.min(4).max(30),
  })
  .pick({
    name: true,
    description: true,
    image: true,
    readme: true,
  })
  .openapi("UpdateOrganizationBody");

export const zDeleteOrganizationParams = z.object({
  organizationId: z.string(),
});
