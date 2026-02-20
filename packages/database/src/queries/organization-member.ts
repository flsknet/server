import { and, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { organizationMember } from "~/schema.js";

export const getOrganizationMember = async (
  db: NodePgDatabase,
  organizationId: string,
  userId: string
) => {
  return (
    await db
      .select()
      .from(organizationMember)
      .where(
        and(
          eq(organizationMember.organizationId, organizationId),
          eq(organizationMember.userId, userId)
        )
      )
  )[0];
};

export const listOrganizationMembers = (
  db: NodePgDatabase,
  organizationId: string
) => {
  return db
    .select()
    .from(organizationMember)
    .where(eq(organizationMember.organizationId, organizationId));
};

export const createOrganizationMember = async (
  db: NodePgDatabase,
  organizationId: string,
  data: Omit<typeof organizationMember.$inferInsert, "organizationId">
) => {
  return (
    await db
      .insert(organizationMember)
      .values({ ...data, organizationId })
      .returning()
  )[0];
};

export const updateOrganizationMember = async (
  db: NodePgDatabase,
  organizationId: string,
  userId: string,
  data: Omit<
    Partial<typeof organizationMember.$inferSelect>,
    "organizationId" | "userId"
  >
) => {
  return (
    await db
      .update(organizationMember)
      .set(data)
      .where(
        and(
          eq(organizationMember.organizationId, organizationId),
          eq(organizationMember.userId, userId)
        )
      )
      .returning()
  )[0];
};

export const deleteOrganizationMember = async (
  db: NodePgDatabase,
  organizationId: string,
  userId: string
) => {
  return (
    await db
      .delete(organizationMember)
      .where(
        and(
          eq(organizationMember.organizationId, organizationId),
          eq(organizationMember.userId, userId)
        )
      )
      .returning()
  )[0];
};
