import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import {
  createBoard,
  deleteBoard,
  getBoard,
  listBoards,
  updateBoard,
} from "@flsk/database";
import { db } from "~/lib/db";

import { tasksRouter } from "./tasks/tasks-router";

import {
  createBoardRoute,
  deleteBoardRoute,
  getBoardRoute,
  listBoardsRoute,
  updateBoardRoute,
} from "./boards-openapi";
import { zBoard } from "./boards-schema";

const router = new OpenAPIHono();

router.route("/:boardId/tasks", tasksRouter);

router.openapi(listBoardsRoute, async (c) => {
  const { organizationId } = c.req.valid("param");

  const boards = await listBoards(db, organizationId);

  return c.json(zBoard.array().parse(boards));
});

router.openapi(getBoardRoute, async (c) => {
  const { organizationId, boardId } = c.req.valid("param");

  const board = await getBoard(db, organizationId, boardId);

  if (!board) {
    throw new HTTPException(404);
  }

  return c.json(zBoard.parse(board));
});

router.openapi(createBoardRoute, async (c) => {
  const user = c.get("user");
  const member = c.get("member");

  const { organizationId } = c.req.valid("param");
  const body = c.req.valid("json");

  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  const board = await createBoard(db, organizationId, {
    ...body,
    createdBy: user.id,
  });

  if (!board) {
    throw new HTTPException(500);
  }

  return c.json(zBoard.parse(board), 201);
});

router.openapi(updateBoardRoute, async (c) => {
  const member = c.get("member");

  const { organizationId, boardId } = c.req.valid("param");
  const body = c.req.valid("json");

  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  const board = await getBoard(db, organizationId, boardId);

  if (!board) {
    throw new HTTPException(404);
  }

  await updateBoard(db, organizationId, boardId, body);

  return c.body(null, 200);
});

router.openapi(deleteBoardRoute, async (c) => {
  const member = c.get("member");

  const { organizationId, boardId } = c.req.valid("param");

  if (member.role != "owner" && member.role != "admin") {
    throw new HTTPException(403);
  }

  const board = await getBoard(db, organizationId, boardId);

  if (!board) {
    throw new HTTPException(404);
  }

  await deleteBoard(db, organizationId, boardId);

  return c.body(null, 204);
});

export { router as boardsRouter };
