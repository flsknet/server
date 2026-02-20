import { and, eq, exists, getTableColumns } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { discussion, discussionComment } from "~/schema.js";

export const getDiscussionComment = async (
  db: NodePgDatabase,
  organizationId: string,
  discussionId: string,
  commentId: string
) => {
  return (
    await db
      .select(getTableColumns(discussionComment))
      .from(discussionComment)
      .innerJoin(discussion, eq(discussionComment.discussionId, discussion.id))
      .where(
        and(
          eq(discussion.organizationId, organizationId),
          eq(discussionComment.discussionId, discussionId),
          eq(discussionComment.id, commentId)
        )
      )
  )[0];
};

export const listDiscussionComments = (
  db: NodePgDatabase,
  organizationId: string,
  discussionId: string
) => {
  return db
    .select(getTableColumns(discussionComment))
    .from(discussionComment)
    .innerJoin(discussion, eq(discussionComment.discussionId, discussion.id))
    .where(
      and(
        eq(discussion.organizationId, organizationId),
        eq(discussionComment.discussionId, discussionId)
      )
    );
};

export const createDiscussionComment = async (
  db: NodePgDatabase,
  organizationId: string,
  discussionId: string,
  values: Omit<typeof discussionComment.$inferInsert, "discussionId">
) => {
  // Verify that the discussion belongs to the organization.
  const result = await db
    .select()
    .from(discussion)
    .where(
      and(
        eq(discussion.organizationId, organizationId),
        eq(discussion.id, discussionId)
      )
    );

  if (!result) {
    return undefined;
  }

  return (
    await db
      .insert(discussionComment)
      .values({ ...values, discussionId })
      .returning()
  )[0];
};

export const updateDiscussionComment = async (
  db: NodePgDatabase,
  organizationId: string,
  discussionId: string,
  commentId: string,
  data: Omit<Partial<typeof discussionComment.$inferSelect>, "discussionId">
) => {
  return (
    await db
      .update(discussionComment)
      .set(data)
      .where(
        and(
          eq(discussionComment.discussionId, discussionId),
          eq(discussionComment.id, commentId),
          exists(
            db
              .select()
              .from(discussion)
              .where(
                and(
                  eq(discussion.organizationId, organizationId),
                  eq(discussion.id, discussionId)
                )
              )
          )
        )
      )
      .returning()
  )[0];
};

export const deleteDiscussionComment = async (
  db: NodePgDatabase,
  organizationId: string,
  discussionId: string,
  commentId: string
) => {
  return (
    await db
      .delete(discussionComment)
      .where(
        and(
          eq(discussionComment.discussionId, discussionId),
          eq(discussionComment.id, commentId),
          exists(
            db
              .select()
              .from(discussion)
              .where(
                and(
                  eq(discussion.organizationId, organizationId),
                  eq(discussion.id, discussionId)
                )
              )
          )
        )
      )
      .returning()
  )[0];
};
