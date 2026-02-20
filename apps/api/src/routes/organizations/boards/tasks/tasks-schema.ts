import { boardTask } from "@flsk/database";
import { z } from "@hono/zod-openapi";

import { schemaFactory } from "~/lib/schema-factory.js";

export const zBoardTask = schemaFactory
  .createSelectSchema(boardTask)
  .omit({
    boardId: true,
  })
  .openapi("BoardTask");

export const zGetBoardTaskParams = z.object({
  organizationId: z.string(),
  boardId: z.string(),
  taskId: z.string(),
});

export const zListBoardTasksParams = z.object({
  organizationId: z.string(),
  boardId: z.string(),
});

export const zCreateBoardTaskParams = z.object({
  organizationId: z.string(),
  boardId: z.string(),
});

export const zCreateBoardTaskBody = schemaFactory
  .createInsertSchema(boardTask)
  .pick({
    title: true,
    description: true,
    status: true,
    assignedTo: true,
  })
  .openapi("CreateBoardTask");

export const zUpdateBoardTaskParams = z.object({
  organizationId: z.string(),
  boardId: z.string(),
  taskId: z.string(),
});

export const zUpdateBoardTaskBody = schemaFactory
  .createUpdateSchema(boardTask)
  .pick({
    title: true,
    description: true,
    status: true,
    assignedTo: true,
  })
  .openapi("UpdateBoardTask");

export const zDeleteBoardTaskParams = z.object({
  organizationId: z.string(),
  boardId: z.string(),
  taskId: z.string(),
});
