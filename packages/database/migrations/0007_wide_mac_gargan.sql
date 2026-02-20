ALTER TABLE "board_task" ADD COLUMN "assigned_to" text[] DEFAULT ARRAY[]::text[];--> statement-breakpoint
ALTER TABLE "organization" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "organization_invite" ADD COLUMN "expires_at" timestamp(3) with time zone;--> statement-breakpoint
ALTER TABLE "organization_member" ADD COLUMN "joined_at" timestamp(3) with time zone DEFAULT now() NOT NULL;