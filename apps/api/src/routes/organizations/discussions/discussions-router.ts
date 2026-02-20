import { OpenAPIHono } from "@hono/zod-openapi";
import { HTTPException } from "hono/http-exception";

import {
  createDiscussion,
  createDiscussionComment,
  deleteDiscussion,
  getDiscussion,
  listDiscussions,
  updateDiscussion,
} from "@flsk/database";
import { db } from "~/lib/db.js";

import {
  createDiscussionRoute,
  deleteDiscussionRoute,
  getDiscussionRoute,
  listDiscussionsRoute,
  updateDiscussionRoute,
} from "./discussions-openapi.js";
import { zDiscussion } from "./discussions-schema.js";

import { commentsRouter } from "./comments/comments-router.js";

const router = new OpenAPIHono();

router.route("/:discussionId/comments", commentsRouter);

router.openapi(listDiscussionsRoute, async (c) => {
  const { organizationId } = c.req.valid("param");

  const discussions = await listDiscussions(db, organizationId);

  return c.json(zDiscussion.array().parse(discussions));
});

router.openapi(getDiscussionRoute, async (c) => {
  const { organizationId, discussionId } = c.req.valid("param");

  const discussion = await getDiscussion(db, organizationId, discussionId);

  if (!discussion) {
    throw new HTTPException(404);
  }

  return c.json(zDiscussion.parse(discussion));
});

router.openapi(createDiscussionRoute, async (c) => {
  const user = c.get("user");

  const { organizationId } = c.req.valid("param");
  const body = c.req.valid("json");

  const discussion = await createDiscussion(db, organizationId, {
    title: body.title,
    createdBy: user.id,
  });

  if (!discussion) {
    throw new HTTPException(500);
  }

  if (body.content) {
    await createDiscussionComment(db, organizationId, discussion.id, {
      content: body.content,
      createdBy: user.id,
    });
  }

  return c.json(zDiscussion.parse(discussion), 201);
});

router.openapi(updateDiscussionRoute, async (c) => {
  const user = c.get("user");

  const { organizationId, discussionId } = c.req.valid("param");
  const body = c.req.valid("json");

  const discussion = await getDiscussion(db, organizationId, discussionId);

  if (!discussion) {
    throw new HTTPException(404);
  }

  if (discussion.createdBy != user.id) {
    throw new HTTPException(403);
  }

  await updateDiscussion(db, organizationId, discussionId, body);

  return c.body(null, 200);
});

router.openapi(deleteDiscussionRoute, async (c) => {
  const user = c.get("user");
  const member = c.get("member");

  const { organizationId, discussionId } = c.req.valid("param");

  const discussion = await getDiscussion(db, organizationId, discussionId);

  if (!discussion) {
    throw new HTTPException(404);
  }

  if (discussion.createdBy != user.id) {
    if (member.role != "owner" && member.role != "admin") {
      throw new HTTPException(403);
    }
  }

  await deleteDiscussion(db, organizationId, discussionId);

  return c.body(null, 204);
});

export { router as discussionsRouter };
