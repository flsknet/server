import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { user } from "~/schema.js";

export const getUser = async (db: NodePgDatabase, userId: string) => {
  return (await db.select().from(user).where(eq(user.id, userId)))[0];
};
