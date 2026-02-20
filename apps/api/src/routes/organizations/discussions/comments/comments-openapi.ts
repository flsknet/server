import { createRoute } from "@hono/zod-openapi";

import {
  zCreateDiscussionCommentBody,
  zCreateDiscussionCommentParams,
  zDeleteDiscussionCommentParams,
  zDiscussionComment,
  zGetDiscussionCommentParams,
  zListDiscussionCommentsParams,
  zUpdateDiscussionCommentBody,
  zUpdateDiscussionCommentParams,
} from "./comments-schema.js";

export const listDiscussionCommentsRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listDiscussionComments",
  summary: "List discussion comments",
  description: "Retrieve comments in a discussion.",
  tags: ["organizations", "discussions", "comments"],
  request: {
    params: zListDiscussionCommentsParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zDiscussionComment.array() },
      },
    },
  },
});

export const getDiscussionCommentRoute = createRoute({
  method: "get",
  path: "/{commentId}",
  operationId: "getDiscussionComment",
  summary: "Get discussion comment",
  description: "Retrieve a comment in a discussion.",
  tags: ["organizations", "discussions", "comments"],
  request: {
    params: zGetDiscussionCommentParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zDiscussionComment },
      },
    },
  },
});

export const createDiscussionCommentRoute = createRoute({
  method: "post",
  path: "/",
  operationId: "createDiscussionComment",
  summary: "Create discussion comment",
  description: "Create a comment in a discussion.",
  tags: ["organizations", "discussions", "comments"],
  request: {
    params: zCreateDiscussionCommentParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zCreateDiscussionCommentBody },
      },
    },
  },
  responses: {
    201: {
      description: "",
      content: {
        "application/json": { schema: zDiscussionComment },
      },
    },
  },
});

export const updateDiscussionCommentRoute = createRoute({
  method: "patch",
  path: "/{commentId}",
  operationId: "updateDiscussionComment",
  summary: "Update discussion comment",
  description: "Update a comment in a discussion.",
  tags: ["organizations", "discussions", "comments"],
  request: {
    params: zUpdateDiscussionCommentParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zUpdateDiscussionCommentBody },
      },
    },
  },
  responses: {
    200: {
      description: "",
    },
  },
});

export const deleteDiscussionCommentRoute = createRoute({
  method: "delete",
  path: "/{commentId}",
  operationId: "deleteDiscussionComment",
  summary: "Delete discussion comment",
  description: "Delete a comment in a discussion",
  tags: ["organizations", "discussions", "comments"],
  request: {
    params: zDeleteDiscussionCommentParams,
  },
  responses: {
    204: {
      description: "",
    },
  },
});
