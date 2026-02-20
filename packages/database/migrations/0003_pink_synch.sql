ALTER TABLE "shift" DROP CONSTRAINT "shift_assigned_to_user_id_fk";
--> statement-breakpoint
ALTER TABLE "shift" ADD CONSTRAINT "shift_assigned_to_user_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;