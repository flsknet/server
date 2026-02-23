import { serve } from "@hono/node-server";

import { migrateToLatest } from "@flsk/database";
import { db } from "~/lib/db.js";

import { app } from "~/app.js";

migrateToLatest(db);

const server = serve({
  fetch: app.fetch,
  port: 3000,
});

server.on("listening", () => {
  console.log(`Server is up and listening on port \x1b[33m3000\x1b[0m.`);
});

process.on("SIGINT", () => {
  server.close();
  process.exit(0);
});

process.on("SIGTERM", () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
