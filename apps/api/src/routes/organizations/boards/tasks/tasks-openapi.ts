import { createRoute } from "@hono/zod-openapi";

import {
  zBoardTask,
  zCreateBoardTaskBody,
  zCreateBoardTaskParams,
  zDeleteBoardTaskParams,
  zGetBoardTaskParams,
  zListBoardTasksParams,
  zUpdateBoardTaskBody,
  zUpdateBoardTaskParams,
} from "./tasks-schema";

export const listBoardTasksRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listBoardTasks",
  summary: "List board tasks",
  description: "Retrieve tasks on a board.",
  tags: ["organizations", "boards", "tasks"],
  request: {
    params: zListBoardTasksParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zBoardTask.array() },
      },
    },
  },
});

export const getBoardTaskRoute = createRoute({
  method: "get",
  path: "/{taskId}",
  operationId: "getBoardTask",
  summary: "Get board task",
  description: "Retrieve a task on a board.",
  tags: ["organizations", "boards", "tasks"],
  request: {
    params: zGetBoardTaskParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zBoardTask },
      },
    },
  },
});

export const createBoardTaskRoute = createRoute({
  method: "post",
  path: "/",
  operationId: "createBoardTask",
  summary: "Create board task",
  description: "Create a task on a board.",
  tags: ["organizations", "boards", "tasks"],
  request: {
    params: zCreateBoardTaskParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zCreateBoardTaskBody },
      },
    },
  },
  responses: {
    201: {
      description: "",
      content: {
        "application/json": { schema: zBoardTask },
      },
    },
  },
});

export const updateBoardTaskRoute = createRoute({
  method: "patch",
  path: "/{taskId}",
  operationId: "updateBoardTask",
  summary: "Update board task",
  description: "Update a task on a board.",
  tags: ["organizations", "boards", "tasks"],
  request: {
    params: zUpdateBoardTaskParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zUpdateBoardTaskBody },
      },
    },
  },
  responses: {
    200: {
      description: "",
    },
  },
});

export const deleteBoardTaskRoute = createRoute({
  method: "delete",
  path: "/{taskId}",
  operationId: "deleteBoardTask",
  summary: "Delete board task",
  description: "Delete a task on a board.",
  tags: ["organizations", "boards", "tasks"],
  request: {
    params: zDeleteBoardTaskParams,
  },
  responses: {
    204: {
      description: "",
    },
  },
});
