ALTER TABLE "board" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "board" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "board_task" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "board_task" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "discussion" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "discussion" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "discussion_comment" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "discussion_comment" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "shift" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "shift" ALTER COLUMN "created_at" SET NOT NULL;