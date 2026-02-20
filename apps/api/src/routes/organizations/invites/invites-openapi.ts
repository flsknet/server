import { createRoute } from "@hono/zod-openapi";

import {
  zCreateOrganizationInviteBody,
  zCreateOrganizationInviteParams,
  zDeleteOrganizationInviteParams,
  zGetOrganizationInviteParams,
  zListOrganizationInvitesParams,
  zOrganizationInvite,
  zUpdateOrganizationInviteBody,
  zUpdateOrganizationInviteParams,
} from "./invites-schema.js";

export const listOrganizationInvitesRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listOrganizationInvites",
  summary: "List organization invites",
  description: "Retrieve invites in an organization.",
  tags: ["organizations", "invites"],
  request: {
    params: zListOrganizationInvitesParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zOrganizationInvite.array() },
      },
    },
  },
});

export const getOrganizationInviteRoute = createRoute({
  method: "get",
  path: "/{inviteId}",
  operationId: "getOrganizationInvite",
  summary: "Get organization invite",
  description: "Retrieve an invite in an organization.",
  tags: ["organizations", "invites"],
  request: {
    params: zGetOrganizationInviteParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zOrganizationInvite },
      },
    },
  },
});

export const createOrganizationInviteRoute = createRoute({
  method: "post",
  path: "/",
  operationId: "createOrganizationInvite",
  summary: "Create organization invite",
  description: "Create an invite in an organization.",
  tags: ["organizations", "invites"],
  request: {
    params: zCreateOrganizationInviteParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zCreateOrganizationInviteBody },
      },
    },
  },
  responses: {
    201: {
      description: "",
      content: {
        "application/json": { schema: zOrganizationInvite },
      },
    },
  },
});

export const updateOrganizationInviteRoute = createRoute({
  method: "patch",
  path: "/{inviteId}",
  operationId: "updateOrganizationInvite",
  summary: "Updane organization invite",
  description: "Update an invite in an organization.",
  tags: ["organizations", "invites"],
  request: {
    params: zUpdateOrganizationInviteParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zUpdateOrganizationInviteBody },
      },
    },
  },
  responses: {
    200: {
      description: "",
    },
  },
});

export const deleteOrganizationInviteRoute = createRoute({
  method: "delete",
  path: "/{inviteId}",
  operationId: "deleteOrganizationInvite",
  summary: "Delete organization invite",
  description: "Delete an invite in an organization.",
  tags: ["organizations", "invites"],
  request: {
    params: zDeleteOrganizationInviteParams,
  },
  responses: {
    204: {
      description: "",
    },
  },
});
