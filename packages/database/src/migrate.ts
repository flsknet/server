import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { join } from "node:path";

export const migrateToLatest = (db: NodePgDatabase) => {
  return migrate(db, {
    migrationsFolder: join(import.meta.dirname, "../migrations"),
  });
};
