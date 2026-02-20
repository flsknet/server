import { discussionComment } from "@flsk/database";
import { z } from "@hono/zod-openapi";

import { schemaFactory } from "~/lib/schema-factory.js";

export const zDiscussionComment = schemaFactory
  .createSelectSchema(discussionComment)
  .omit({
    discussionId: true,
  })
  .openapi("DiscussionComment");

export const zGetDiscussionCommentParams = z.object({
  organizationId: z.string(),
  discussionId: z.string(),
  commentId: z.string(),
});

export const zListDiscussionCommentsParams = z.object({
  organizationId: z.string(),
  discussionId: z.string(),
});

export const zCreateDiscussionCommentParams = z.object({
  organizationId: z.string(),
  discussionId: z.string(),
});

export const zCreateDiscussionCommentBody = schemaFactory
  .createInsertSchema(discussionComment)
  .pick({
    content: true,
  })
  .openapi("CreateDiscussionComment");

export const zUpdateDiscussionCommentParams = z.object({
  organizationId: z.string(),
  discussionId: z.string(),
  commentId: z.string(),
});

export const zUpdateDiscussionCommentBody = schemaFactory
  .createUpdateSchema(discussionComment)
  .pick({
    content: true,
  })
  .openapi("UpdateDiscussionComment");

export const zDeleteDiscussionCommentParams = z.object({
  organizationId: z.string(),
  discussionId: z.string(),
  commentId: z.string(),
});
