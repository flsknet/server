import { createId, init } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const organization = pgTable("organization", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  readme: text("readme"),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const organizationMemberRole = pgEnum("organization_member_role", [
  "owner",
  "admin",
  "member",
]);

export const organizationMember = pgTable(
  "organization_member",
  {
    role: organizationMemberRole().notNull().default("member"),
    joinedAt: timestamp("joined_at", {
      mode: "string",
      precision: 3,
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.organizationId, table.userId] })]
);

export const organizationInvite = pgTable("organization_invite", {
  id: text("id")
    .primaryKey()
    .$defaultFn(init({ length: 6 })),
  singleUse: boolean("single_use").notNull().default(false),
  expiresAt: timestamp("expires_at", {
    mode: "string",
    precision: 3,
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  createdBy: text("created_by")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
});

export const discussion = pgTable("discussion", {
  id: text("id").primaryKey().$defaultFn(createId),
  title: text("title").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
});

export const discussionComment = pgTable("discussion_comment", {
  id: text("id").primaryKey().$defaultFn(createId),
  content: text("content").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  discussionId: text("discussion_id")
    .notNull()
    .references(() => discussion.id, { onDelete: "cascade" }),
});

export const board = pgTable("board", {
  id: text("id").primaryKey().$defaultFn(createId),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
});

export const boardTaskStatus = pgEnum("board_task_status", [
  "todo",
  "inprogress",
  "done",
]);

export const boardTask = pgTable("board_task", {
  id: text("id").primaryKey().$defaultFn(createId),
  title: text("title").notNull(),
  description: text("description"),
  status: boardTaskStatus().notNull().default("todo"),
  assignedTo: text("assigned_to")
    .array()
    .default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at", {
    mode: "string",
    precision: 3,
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
  createdBy: text("created_by").references(() => user.id, {
    onDelete: "set null",
  }),
  boardId: text("board_id")
    .notNull()
    .references(() => board.id, { onDelete: "cascade" }),
});
