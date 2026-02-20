import { and, eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { organizationInvite } from "~/schema.js";

export const findOrganizationInvite = async (
  db: NodePgDatabase,
  inviteId: string
) => {
  return (
    await db
      .select()
      .from(organizationInvite)
      .where(eq(organizationInvite.id, inviteId))
  )[0];
};

export const getOrganizationInvite = async (
  db: NodePgDatabase,
  organizationId: string,
  inviteId: string
) => {
  return (
    await db
      .select()
      .from(organizationInvite)
      .where(
        and(
          eq(organizationInvite.organizationId, organizationId),
          eq(organizationInvite.id, inviteId)
        )
      )
  )[0];
};

export const listOrganizationInvites = (
  db: NodePgDatabase,
  organizationId: string
) => {
  return db
    .select()
    .from(organizationInvite)
    .where(eq(organizationInvite.organizationId, organizationId));
};

export const createOrganizationInvite = async (
  db: NodePgDatabase,
  organizationId: string,
  data: Omit<typeof organizationInvite.$inferInsert, "organizationId">
) => {
  return (
    await db
      .insert(organizationInvite)
      .values({ ...data, organizationId })
      .returning()
  )[0];
};

export const updateOrganizationInvite = async (
  db: NodePgDatabase,
  organizationId: string,
  inviteId: string,
  data: Partial<typeof organizationInvite.$inferSelect>
) => {
  return (
    await db
      .update(organizationInvite)
      .set(data)
      .where(
        and(
          eq(organizationInvite.organizationId, organizationId),
          eq(organizationInvite.id, inviteId)
        )
      )
      .returning()
  )[0];
};

export const deleteOrganizationInvite = async (
  db: NodePgDatabase,
  organizationId: string,
  inviteId: string
) => {
  return (
    await db
      .delete(organizationInvite)
      .where(
        and(
          eq(organizationInvite.organizationId, organizationId),
          eq(organizationInvite.id, inviteId)
        )
      )
      .returning()
  )[0];
};
