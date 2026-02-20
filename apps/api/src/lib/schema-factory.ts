import { z } from "@hono/zod-openapi";
import { createSchemaFactory } from "drizzle-zod";

export const schemaFactory = createSchemaFactory({
  zodInstance: z,
});
