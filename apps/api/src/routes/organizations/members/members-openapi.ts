import { createRoute } from "@hono/zod-openapi";

import {
  zDeleteOrganizationMemberParams,
  zGetOrganizationMemberParams,
  zListOrganizationMembersParams,
  zOrganizationMember,
  zUpdateOrganizationMemberBody,
  zUpdateOrganizationMemberParams,
} from "./members-schema.js";

export const listOrganizationMembersRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listOrganizationMembers",
  summary: "List organization members",
  description: "Retrieve members of an organization.",
  tags: ["organization", "members"],
  request: {
    params: zListOrganizationMembersParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zOrganizationMember.array() },
      },
    },
  },
});

export const getOrganizationMemberRoute = createRoute({
  method: "get",
  path: "/{userId}",
  operationId: "getOrganizationMember",
  summary: "Get organization member",
  description: "Retrieve a member of an organization.",
  tags: ["organization", "members"],
  request: {
    params: zGetOrganizationMemberParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zOrganizationMember },
      },
    },
  },
});

export const updateOrganizationMemberRoute = createRoute({
  method: "patch",
  path: "/{userId}",
  operationId: "updateOrganizationMember",
  summary: "Update organization member",
  description: "Update a member of an organization.",
  tags: ["organization", "members"],
  request: {
    params: zUpdateOrganizationMemberParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zUpdateOrganizationMemberBody },
      },
    },
  },
  responses: {
    200: {
      description: "",
    },
  },
});

export const deleteOrganizationMemberRoute = createRoute({
  method: "delete",
  path: "/{userId}",
  operationId: "deleteOrganizationMember",
  summary: "Delete organization member",
  description: "Delete a member of an organization.",
  tags: ["organization", "members"],
  request: {
    params: zDeleteOrganizationMemberParams,
  },
  responses: {
    204: {
      description: "",
    },
  },
});
