import { z } from "@hono/zod-openapi";

export const env = z
  .object({
    CORS_ORIGIN: z.string(),
    DATABASE_URL: z.string(),
    BETTER_AUTH_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
  })
  .parse(process.env);
