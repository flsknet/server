import { createRoute } from "@hono/zod-openapi";

import { organizationGuard } from "~/middleware/organization-guard.js";

import {
  zCreateOrganizationBody,
  zDeleteOrganizationParams,
  zGetOrganizationParams,
  zOrganization,
  zUpdateOrganizationBody,
  zUpdateOrganizationParams,
} from "./organizations-schema.js";

export const listOrganizationsRoute = createRoute({
  method: "get",
  path: "/",
  operationId: "listOrganizations",
  summary: "List organizations",
  description: "Retrieve your organizations.",
  tags: ["organizations"],
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zOrganization.array() },
      },
    },
  },
});

export const getOrganizationRoute = createRoute({
  method: "get",
  path: "/{organizationId}",
  operationId: "getOrganization",
  summary: "Get organization",
  description: "Retrieve an organization.",
  tags: ["organizations"],
  request: {
    params: zGetOrganizationParams,
  },
  responses: {
    200: {
      description: "",
      content: {
        "application/json": { schema: zOrganization },
      },
    },
  },
  middleware: [organizationGuard()],
});

export const createOrganizationRoute = createRoute({
  method: "post",
  path: "/",
  operationId: "createOrganization",
  summary: "Create organization",
  description: "Create an organization.",
  tags: ["organizations"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": { schema: zCreateOrganizationBody },
      },
    },
  },
  responses: {
    201: {
      description: "",
      content: {
        "application/json": { schema: zOrganization },
      },
    },
  },
});

export const updateOrganizationRoute = createRoute({
  method: "patch",
  path: "/{organizationId}",
  operationId: "updateOrganization",
  summary: "Update organization",
  description: "Update an organization.",
  tags: ["organizations"],
  request: {
    params: zUpdateOrganizationParams,
    body: {
      required: true,
      content: {
        "application/json": { schema: zUpdateOrganizationBody },
      },
    },
  },
  responses: {
    200: {
      description: "",
    },
  },
  middleware: [organizationGuard()],
});

export const deleteOrganizationRoute = createRoute({
  method: "delete",
  path: "/{organizationId}",
  operationId: "deleteOrganization",
  summary: "Delete organization",
  description: "Delete an organization.",
  tags: ["organizations"],
  request: {
    params: zDeleteOrganizationParams,
  },
  responses: {
    204: {
      description: "",
    },
  },
  middleware: [organizationGuard()],
});
