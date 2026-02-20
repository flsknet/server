import { discussion } from "@flsk/database";
import { z } from "@hono/zod-openapi";

import { schemaFactory } from "~/lib/schema-factory.js";

export const zDiscussion = schemaFactory
  .createSelectSchema(discussion)
  .omit({
    organizationId: true,
  })
  .extend({
    commentCount: z.number(),
  })
  .openapi("Discussion");

export const zGetDiscussionParams = z.object({
  organizationId: z.string(),
  discussionId: z.string(),
});

export const zListDiscussionsParams = z.object({
  organizationId: z.string(),
});

export const zCreateDiscussionParams = z.object({
  organizationId: z.string(),
});

export const zCreateDiscussionBody = schemaFactory
  .createInsertSchema(discussion)
  .pick({
    title: true,
  })
  .extend({
    content: z.string().min(1).optional(),
  })
  .openapi("CreateDiscussionBody");

export const zUpdateDiscussionParams = z.object({
  organizationId: z.string(),
  discussionId: z.string(),
});

export const zUpdateDiscussionBody = schemaFactory
  .createUpdateSchema(discussion)
  .pick({
    title: true,
  })
  .openapi("UpdateDiscussionBody");

export const zDeleteDiscussionParams = z.object({
  organizationId: z.string(),
  discussionId: z.string(),
});
