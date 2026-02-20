import { and, eq, getTableColumns } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { board, boardTask } from "~/schema.js";

const getBoardSelection = (db: NodePgDatabase) => {
  return {
    ...getTableColumns(board),
    taskCount: db.$count(boardTask, eq(board.id, boardTask.boardId)),
    todoTaskCount: db.$count(
      boardTask,
      and(eq(board.id, boardTask.boardId), eq(boardTask.status, "todo"))
    ),
    inprogressTaskCount: db.$count(
      boardTask,
      and(eq(board.id, boardTask.boardId), eq(boardTask.status, "inprogress"))
    ),
    doneTaskCount: db.$count(
      boardTask,
      and(eq(board.id, boardTask.boardId), eq(boardTask.status, "done"))
    ),
  };
};

export const getBoard = async (
  db: NodePgDatabase,
  organizationId: string,
  boardId: string
) => {
  return (
    await db
      .select(getBoardSelection(db))
      .from(board)
      .where(
        and(eq(board.organizationId, organizationId), eq(board.id, boardId))
      )
  )[0];
};

export const listBoards = (db: NodePgDatabase, organizationId: string) => {
  return db
    .select(getBoardSelection(db))
    .from(board)
    .where(eq(board.organizationId, organizationId));
};

export const createBoard = async (
  db: NodePgDatabase,
  organizationId: string,
  data: Omit<typeof board.$inferInsert, "organizationId">
) => {
  return (
    await db
      .insert(board)
      .values({ ...data, organizationId })
      .returning(getBoardSelection(db))
  )[0];
};

export const updateBoard = async (
  db: NodePgDatabase,
  organizationId: string,
  boardId: string,
  data: Omit<Partial<typeof board.$inferSelect>, "organizationId">
) => {
  return (
    await db
      .update(board)
      .set(data)
      .where(
        and(eq(board.organizationId, organizationId), eq(board.id, boardId))
      )
      .returning(getBoardSelection(db))
  )[0];
};

export const deleteBoard = async (
  db: NodePgDatabase,
  organizationId: string,
  boardId: string
) => {
  return (
    await db
      .delete(board)
      .where(
        and(eq(board.organizationId, organizationId), eq(board.id, boardId))
      )
      .returning(getBoardSelection(db))
  )[0];
};
