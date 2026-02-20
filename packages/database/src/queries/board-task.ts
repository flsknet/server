import { and, eq, exists, getTableColumns } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { board, boardTask } from "~/schema.js";

export const getBoardTask = async (
  db: NodePgDatabase,
  organizationId: string,
  boardId: string,
  taskId: string
) => {
  return (
    await db
      .select(getTableColumns(boardTask))
      .from(boardTask)
      .innerJoin(board, eq(boardTask.boardId, board.id))
      .where(
        and(
          eq(board.organizationId, organizationId),
          eq(boardTask.boardId, boardId),
          eq(boardTask.id, taskId)
        )
      )
  )[0];
};

export const listBoardTasks = (
  db: NodePgDatabase,
  organizationId: string,
  boardId: string
) => {
  return db
    .select(getTableColumns(boardTask))
    .from(boardTask)
    .innerJoin(board, eq(boardTask.boardId, board.id))
    .where(
      and(
        eq(board.organizationId, organizationId),
        eq(boardTask.boardId, boardId)
      )
    );
};

export const createBoardTask = async (
  db: NodePgDatabase,
  organizationId: string,
  boardId: string,
  values: Omit<typeof boardTask.$inferInsert, "boardId">
) => {
  // Verify that the board belongs to the organization.
  const result = await db
    .select()
    .from(board)
    .where(
      and(eq(board.organizationId, organizationId), eq(board.id, boardId))
    );

  if (!result) {
    return undefined;
  }

  return (
    await db
      .insert(boardTask)
      .values({ ...values, boardId })
      .returning()
  )[0];
};

export const updateBoardTask = async (
  db: NodePgDatabase,
  organizationId: string,
  boardId: string,
  taskId: string,
  data: Omit<Partial<typeof boardTask.$inferSelect>, "boardId">
) => {
  return (
    await db
      .update(boardTask)
      .set(data)
      .where(
        and(
          eq(boardTask.boardId, boardId),
          eq(boardTask.id, taskId),
          exists(
            db
              .select()
              .from(board)
              .where(
                and(
                  eq(board.organizationId, organizationId),
                  eq(board.id, boardId)
                )
              )
          )
        )
      )
      .returning()
  )[0];
};

export const deleteBoardTask = async (
  db: NodePgDatabase,
  organizationId: string,
  boardId: string,
  taskId: string
) => {
  return (
    await db
      .delete(boardTask)
      .where(
        and(
          eq(boardTask.boardId, boardId),
          eq(boardTask.id, taskId),
          exists(
            db
              .select()
              .from(board)
              .where(
                and(
                  eq(board.organizationId, organizationId),
                  eq(board.id, boardId)
                )
              )
          )
        )
      )
      .returning()
  )[0];
};
