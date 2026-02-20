import { eq, getTableColumns } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import {
  board,
  discussion,
  organization,
  organizationMember,
} from "~/schema.js";

const getOrganizationSelection = (db: NodePgDatabase) => {
  return {
    ...getTableColumns(organization),
    memberCount: db.$count(
      organizationMember,
      eq(organization.id, organizationMember.organizationId)
    ),
    discussionCount: db.$count(
      discussion,
      eq(organization.id, discussion.organizationId)
    ),
    boardCount: db.$count(board, eq(organization.id, board.organizationId)),
  };
};

export const getOrganization = async (
  db: NodePgDatabase,
  organizationId: string
) => {
  return (
    await db
      .select(getOrganizationSelection(db))
      .from(organization)
      .where(eq(organization.id, organizationId))
  )[0];
};

export const listOrganizations = (db: NodePgDatabase, userId: string) => {
  return db
    .select(getOrganizationSelection(db))
    .from(organization)
    .innerJoin(
      organizationMember,
      eq(organization.id, organizationMember.organizationId)
    )
    .where(eq(organizationMember.userId, userId));
};

export const createOrganization = async (
  db: NodePgDatabase,
  data: typeof organization.$inferInsert
) => {
  return (
    await db
      .insert(organization)
      .values(data)
      .returning(getOrganizationSelection(db))
  )[0];
};

export const updateOrganisaton = async (
  db: NodePgDatabase,
  organizationId: string,
  data: Partial<typeof organization.$inferSelect>
) => {
  return (
    await db
      .update(organization)
      .set(data)
      .where(eq(organization.id, organizationId))
      .returning(getOrganizationSelection(db))
  )[0];
};

export const deleteOrganization = async (
  db: NodePgDatabase,
  organizationId: string
) => {
  return (
    await db
      .delete(organization)
      .where(eq(organization.id, organizationId))
      .returning(getOrganizationSelection(db))
  )[0];
};
