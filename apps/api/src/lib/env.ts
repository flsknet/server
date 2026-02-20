import { z } from "@hono/zod-openapi";

export const env = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    PORT: z.coerce.number(),
    CORS_ORIGIN: z.string(),
    DATABASE_URL: z.string(),
    BETTER_AUTH_URL: z.string(),
    BETTER_AUTH_SECRET: z.string(),
  })
  .parse(process.env);
