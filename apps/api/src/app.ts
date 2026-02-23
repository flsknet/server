import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "hono/cors";

import { auth } from "~/lib/auth.js";
import { env } from "~/lib/env";
import { withAuth } from "~/middleware/with-auth";

import { invitesRouter } from "~/routes/invites/invites-router";
import { organizationsRouter } from "~/routes/organizations/organizations-router.js";
import { usersRouter } from "~/routes/users/users-router.js";

const app = new OpenAPIHono();

app.use(
  cors({
    origin: (origin) => {
      try {
        const url = new URL(origin);

        if (
          url.hostname === "localhost" ||
          url.hostname === "127.0.0.1" ||
          url.hostname === "::1"
        ) {
          return origin;
        }

        return env.CORS_ORIGIN;
      } catch {
        return origin;
      }
    },
    credentials: true,
  })
);

app.on(["POST", "GET"], "/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.route(
  "/v1",
  new OpenAPIHono()
    .use(withAuth())
    .route("/invites", invitesRouter)
    .route("/organizations", organizationsRouter)
    .route("/users", usersRouter)
);

app.doc("/openapi.json", {
  openapi: "3.0.0",
  info: {
    title: "Flask API",
    description: "Open source organization management platform.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "https://api.flsk.net",
      description: "Production Server",
    },
    {
      url: "http://localhost:3000",
      description: "Development Server",
    },
  ],
});

export { app };
