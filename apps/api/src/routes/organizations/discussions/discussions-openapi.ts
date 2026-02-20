import { createRoute } from "@hono/zod-openapi";

import {
  zCreateDiscussionBody,
  zCreateDiscussionParams,
  zDeleteDiscussionParams,
  zDiscussion,
  zGetDiscussionParams,
  zListDiscussionsParams,
  zUpdateDiscussionBody,
  zUpdateDiscussionParams,
} from "./discussions-schema.js";

export const listDiscussionsRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listDiscussions",
  summary: "List discussions",
  description: "Retrieve discussions in an organization.",
  tags: ["organizations", "discussions"],
  request: {
    params: zListDiscussionsParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zDiscussion.array() },
      },
    },
  },
});

export const getDiscussionRoute = createRoute({
  method: "get",
  path: "/{discussionId}",
  operationId: "getDiscussion",
  summary: "Get discussion",
  description: "Retrieve a discussion in an organization.",
  tags: ["organizations", "discussions"],
  request: {
    params: zGetDiscussionParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zDiscussion },
      },
    },
  },
});

export const createDiscussionRoute = createRoute({
  method: "post",
  path: "/",
  operationId: "createDiscussion",
  summary: "Create discussion",
  description: "Create a discussion in an organization.",
  tags: ["organizations", "discussions"],
  request: {
    params: zCreateDiscussionParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zCreateDiscussionBody },
      },
    },
  },
  responses: {
    201: {
      description: "",
      content: {
        "application/json": { schema: zDiscussion },
      },
    },
  },
});

export const updateDiscussionRoute = createRoute({
  method: "patch",
  path: "/{discussionId}",
  operationId: "updateDiscussion",
  summary: "Update discussion",
  description: "Update a discussion in an organization.",
  tags: ["organizations", "discussions"],
  request: {
    params: zUpdateDiscussionParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zUpdateDiscussionBody },
      },
    },
  },
  responses: {
    200: {
      description: "",
    },
  },
});

export const deleteDiscussionRoute = createRoute({
  method: "delete",
  path: "/{discussionId}",
  operationId: "deleteDiscussion",
  summary: "Delete discussion",
  description: "Delete a discussion in an organization.",
  tags: ["organizations", "discussions"],
  request: {
    params: zDeleteDiscussionParams,
  },
  responses: {
    204: {
      description: "",
    },
  },
});
