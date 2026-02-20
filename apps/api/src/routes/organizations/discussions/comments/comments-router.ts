import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import {
  createDiscussionComment,
  deleteDiscussionComment,
  getDiscussionComment,
  listDiscussionComments,
  updateDiscussionComment,
} from "@flsk/database";
import { db } from "~/lib/db.js";

import {
  createDiscussionCommentRoute,
  deleteDiscussionCommentRoute,
  getDiscussionCommentRoute,
  listDiscussionCommentsRoute,
  updateDiscussionCommentRoute,
} from "./comments-openapi.js";
import { zDiscussionComment } from "./comments-schema.js";

const router = new OpenAPIHono();

router.openapi(listDiscussionCommentsRoute, async (c) => {
  const { organizationId, discussionId } = c.req.valid("param");

  const discussionComments = await listDiscussionComments(
    db,
    organizationId,
    discussionId
  );

  return c.json(zDiscussionComment.array().parse(discussionComments));
});

router.openapi(getDiscussionCommentRoute, async (c) => {
  const { organizationId, discussionId, commentId } = c.req.valid("param");

  const discussionComment = await getDiscussionComment(
    db,
    organizationId,
    discussionId,
    commentId
  );

  if (!discussionComment) {
    throw new HTTPException(404);
  }

  return c.json(zDiscussionComment.parse(discussionComment));
});

router.openapi(createDiscussionCommentRoute, async (c) => {
  const user = c.get("user");

  const { organizationId, discussionId } = c.req.valid("param");
  const body = c.req.valid("json");

  const discussionComment = await createDiscussionComment(
    db,
    organizationId,
    discussionId,
    {
      ...body,
      createdBy: user.id,
    }
  );

  if (!discussionComment) {
    throw new HTTPException(500);
  }

  return c.json(zDiscussionComment.parse(discussionComment), 201);
});

router.openapi(updateDiscussionCommentRoute, async (c) => {
  const user = c.get("user");

  const { organizationId, discussionId, commentId } = c.req.valid("param");
  const body = c.req.valid("json");

  const discussionComment = await getDiscussionComment(
    db,
    organizationId,
    discussionId,
    commentId
  );

  if (!discussionComment) {
    throw new HTTPException(404);
  }

  if (discussionComment.createdBy != user.id) {
    throw new HTTPException(403);
  }

  await updateDiscussionComment(
    db,
    organizationId,
    discussionId,
    commentId,
    body
  );

  return c.body(null, 200);
});

router.openapi(deleteDiscussionCommentRoute, async (c) => {
  const user = c.get("user");
  const member = c.get("member");

  const { organizationId, discussionId, commentId } = c.req.valid("param");

  const discussionComment = await getDiscussionComment(
    db,
    organizationId,
    discussionId,
    commentId
  );

  if (!discussionComment) {
    throw new HTTPException(404);
  }

  if (discussionComment.createdBy != user.id) {
    if (member.role != "owner" && member.role != "admin") {
      throw new HTTPException(403);
    }
  }

  await deleteDiscussionComment(db, organizationId, discussionId, commentId);

  return c.body(null, 204);
});

export { router as commentsRouter };
