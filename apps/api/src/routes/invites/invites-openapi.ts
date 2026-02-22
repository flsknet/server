import { createRoute } from "@hono/zod-openapi";

import {
  zAcceptOrganizationInviteParams,
  zFindOrganizationInviteParams,
  zOrganizationInvitePreview,
} from "./invites-schema";

export const findOrganizationInviteRoute = createRoute({
  method: "get",
  path: "/{inviteId}",
  operationId: "findOrganizationInvite",
  summary: "Find organization invite",
  description: "Retrieve an invite for an organization.",
  tags: ["organizations", "invites"],
  request: {
    params: zFindOrganizationInviteParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zOrganizationInvitePreview },
      },
    },
  },
});

export const acceptOrganizationInviteRoute = createRoute({
  method: "post",
  path: "/{inviteId}/accept",
  operationId: "acceptOrganizationInvite",
  summary: "Accept organization invite",
  description: "Accept an invite and join an organization.",
  tags: ["organizations", "invites"],
  request: {
    params: zAcceptOrganizationInviteParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zOrganizationInvitePreview },
      },
    },
  },
});
