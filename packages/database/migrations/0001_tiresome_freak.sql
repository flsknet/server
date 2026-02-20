ALTER TYPE "public"."organisation_member_role" RENAME TO "organization_member_role";--> statement-breakpoint
ALTER TABLE "organisation" RENAME TO "organization";--> statement-breakpoint
ALTER TABLE "organisation_member" RENAME TO "organization_member";--> statement-breakpoint
ALTER TABLE "board" RENAME COLUMN "organisation_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "discussion" RENAME COLUMN "organisation_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "organization_member" RENAME COLUMN "organisation_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "shift" RENAME COLUMN "organisation_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "board" DROP CONSTRAINT "board_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "discussion" DROP CONSTRAINT "discussion_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_member" DROP CONSTRAINT "organisation_member_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_member" DROP CONSTRAINT "organisation_member_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "shift" DROP CONSTRAINT "shift_organisation_id_organisation_id_fk";
--> statement-breakpoint
ALTER TABLE "organization_member" DROP CONSTRAINT "organisation_member_organisation_id_user_id_pk";--> statement-breakpoint
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_organization_id_user_id_pk" PRIMARY KEY("organization_id","user_id");--> statement-breakpoint
ALTER TABLE "board" ADD CONSTRAINT "board_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion" ADD CONSTRAINT "discussion_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "organization_member" ADD CONSTRAINT "organization_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift" ADD CONSTRAINT "shift_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;