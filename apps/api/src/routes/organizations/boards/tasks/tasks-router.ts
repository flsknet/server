import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import {
  createBoardTask,
  deleteBoardTask,
  getBoardTask,
  listBoardTasks,
  updateBoardTask,
} from "@flsk/database";
import { db } from "~/lib/db";

import {
  createBoardTaskRoute,
  deleteBoardTaskRoute,
  getBoardTaskRoute,
  listBoardTasksRoute,
  updateBoardTaskRoute,
} from "./tasks-openapi";
import { zBoardTask } from "./tasks-schema";

const router = new OpenAPIHono();

router.openapi(listBoardTasksRoute, async (c) => {
  const { organizationId, boardId } = c.req.valid("param");

  const boardTasks = await listBoardTasks(db, organizationId, boardId);

  return c.json(zBoardTask.array().parse(boardTasks));
});

router.openapi(getBoardTaskRoute, async (c) => {
  const { organizationId, boardId, taskId } = c.req.valid("param");

  const boardTask = await getBoardTask(db, organizationId, boardId, taskId);

  if (!boardTask) {
    throw new HTTPException(404);
  }

  return c.json(zBoardTask.parse(boardTask));
});

router.openapi(createBoardTaskRoute, async (c) => {
  const user = c.get("user");
  const member = c.get("member");

  const { organizationId, boardId } = c.req.valid("param");
  const body = c.req.valid("json");

  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  const boardTask = await createBoardTask(db, organizationId, boardId, {
    ...body,
    createdBy: user.id,
  });

  if (!boardTask) {
    throw new HTTPException(500);
  }

  return c.json(zBoardTask.parse(boardTask), 201);
});

router.openapi(updateBoardTaskRoute, async (c) => {
  const member = c.get("member");

  const { organizationId, boardId, taskId } = c.req.valid("param");
  const body = c.req.valid("json");

  const boardTask = await getBoardTask(db, organizationId, boardId, taskId);

  if (!boardTask) {
    throw new HTTPException(404);
  }

  if (member.role != "owner" && member.role != "admin") {
    if (boardTask.assignedTo && boardTask.assignedTo.includes(member.userId)) {
      await updateBoardTask(db, organizationId, boardId, taskId, {
        status: body.status,
      });

      return c.body(null, 200);
    }

    throw new HTTPException(403);
  }

  await updateBoardTask(db, organizationId, boardId, taskId, body);

  return c.body(null, 200);
});

router.openapi(deleteBoardTaskRoute, async (c) => {
  const member = c.get("member");

  const { organizationId, boardId, taskId } = c.req.valid("param");

  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  const boardTask = await getBoardTask(db, organizationId, boardId, taskId);

  if (!boardTask) {
    throw new HTTPException(404);
  }

  await deleteBoardTask(db, organizationId, boardId, taskId);

  return c.body(null, 204);
});

export { router as tasksRouter };
