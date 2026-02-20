import { createRoute } from "@hono/zod-openapi";

import {
  zBoard,
  zCreateBoardBody,
  zCreateBoardParams,
  zDeleteBoardParams,
  zGetBoardParams,
  zListBoardsParams,
  zUpdateBoardBody,
  zUpdateBoardParams,
} from "./boards-schema";

export const listBoardsRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listBoards",
  summary: "List boards",
  description: "Retrieve boards in an organization.",
  tags: ["organizations", "boards"],
  request: {
    params: zListBoardsParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zBoard.array() },
      },
    },
  },
});

export const getBoardRoute = createRoute({
  method: "get",
  path: "/{boardId}",
  operationId: "getBoard",
  summary: "Get board",
  description: "Retrieve a board in an organization.",
  tags: ["organizations", "boards"],
  request: {
    params: zGetBoardParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zBoard },
      },
    },
  },
});

export const createBoardRoute = createRoute({
  method: "post",
  path: "/",
  operationId: "createBoard",
  summary: "Create board",
  description: "Create a board in an organization.",
  tags: ["organizations", "boards"],
  request: {
    params: zCreateBoardParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zCreateBoardBody },
      },
    },
  },
  responses: {
    201: {
      description: "",
      content: {
        "application/json": { schema: zBoard },
      },
    },
  },
});

export const updateBoardRoute = createRoute({
  method: "patch",
  path: "/{boardId}",
  operationId: "updateBoard",
  summary: "Update board",
  description: "Update a board in an organization.",
  tags: ["organizations", "boards"],
  request: {
    params: zUpdateBoardParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zUpdateBoardBody },
      },
    },
  },
  responses: {
    200: {
      description: "",
    },
  },
});

export const deleteBoardRoute = createRoute({
  method: "delete",
  path: "/{boardId}",
  operationId: "deleteBoard",
  summary: "Delete board",
  description: "Delete a board in an organization.",
  tags: ["organizations", "boards"],
  request: {
    params: zDeleteBoardParams,
  },
  responses: {
    204: {
      description: "",
    },
  },
});
