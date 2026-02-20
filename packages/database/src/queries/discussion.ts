import { and, eq, getTableColumns } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { discussion, discussionComment } from "~/schema.js";

const getDiscussionSelection = (db: NodePgDatabase) => {
  return {
    ...getTableColumns(discussion),
    commentCount: db.$count(
      discussionComment,
      eq(discussion.id, discussionComment.discussionId)
    ),
  };
};

export const getDiscussion = async (
  db: NodePgDatabase,
  organizationId: string,
  discussionId: string
) => {
  return (
    await db
      .select(getDiscussionSelection(db))
      .from(discussion)
      .where(
        and(
          eq(discussion.organizationId, organizationId),
          eq(discussion.id, discussionId)
        )
      )
  )[0];
};

export const listDiscussions = (db: NodePgDatabase, organizationId: string) => {
  return db
    .select(getDiscussionSelection(db))
    .from(discussion)
    .where(eq(discussion.organizationId, organizationId));
};

export const createDiscussion = async (
  db: NodePgDatabase,
  organizationId: string,
  data: Omit<typeof discussion.$inferInsert, "organizationId">
) => {
  return (
    await db
      .insert(discussion)
      .values({ ...data, organizationId })
      .returning(getDiscussionSelection(db))
  )[0];
};

export const updateDiscussion = async (
  db: NodePgDatabase,
  organizationId: string,
  discussionId: string,
  data: Omit<Partial<typeof discussion.$inferSelect>, "organizationId">
) => {
  return (
    await db
      .update(discussion)
      .set(data)
      .where(
        and(
          eq(discussion.organizationId, organizationId),
          eq(discussion.id, discussionId)
        )
      )
      .returning(getDiscussionSelection(db))
  )[0];
};

export const deleteDiscussion = async (
  db: NodePgDatabase,
  organizationId: string,
  discussionId: string
) => {
  return (
    await db
      .delete(discussion)
      .where(
        and(
          eq(discussion.organizationId, organizationId),
          eq(discussion.id, discussionId)
        )
      )
      .returning(getDiscussionSelection(db))
  )[0];
};
