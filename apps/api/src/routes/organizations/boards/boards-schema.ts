import { board } from "@flsk/database";
import { z } from "@hono/zod-openapi";

import { schemaFactory } from "~/lib/schema-factory.js";

export const zBoard = schemaFactory
  .createSelectSchema(board)
  .omit({
    organizationId: true,
  })
  .extend({
    taskCount: z.number(),
    todoTaskCount: z.number(),
    inprogressTaskCount: z.number(),
    doneTaskCount: z.number(),
  })
  .openapi("Board");

export const zGetBoardParams = z.object({
  organizationId: z.string(),
  boardId: z.string(),
});

export const zListBoardsParams = z.object({
  organizationId: z.string(),
});

export const zCreateBoardParams = z.object({
  organizationId: z.string(),
});

export const zCreateBoardBody = schemaFactory
  .createInsertSchema(board)
  .pick({
    name: true,
  })
  .openapi("CreateBoardBody");

export const zUpdateBoardParams = z.object({
  organizationId: z.string(),
  boardId: z.string(),
});

export const zUpdateBoardBody = schemaFactory
  .createUpdateSchema(board)
  .pick({
    name: true,
  })
  .openapi("UpdateBoardBody");

export const zDeleteBoardParams = z.object({
  organizationId: z.string(),
  boardId: z.string(),
});
