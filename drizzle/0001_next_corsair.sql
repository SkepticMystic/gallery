CREATE TYPE "public"."page_view_resource_kind" AS ENUM('gallery', 'piece', 'artist');--> statement-breakpoint
ALTER TABLE "page_view" RENAME COLUMN "user_id" TO "viewer_user_id";--> statement-breakpoint
ALTER TABLE "page_view" DROP CONSTRAINT "page_view_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "provider_id" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."provider_id";--> statement-breakpoint
CREATE TYPE "public"."provider_id" AS ENUM('credential', 'google');--> statement-breakpoint
ALTER TABLE "account" ALTER COLUMN "provider_id" SET DATA TYPE "public"."provider_id" USING "provider_id"::"public"."provider_id";--> statement-breakpoint
ALTER TABLE "page_view" ADD COLUMN "resource_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "page_view" ADD COLUMN "resource_kind" "page_view_resource_kind" NOT NULL;--> statement-breakpoint
ALTER TABLE "page_view" ADD COLUMN "org_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "page_view" ADD CONSTRAINT "page_view_viewer_user_id_user_id_fk" FOREIGN KEY ("viewer_user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "page_view" ADD CONSTRAINT "page_view_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_page_view_org_id" ON "page_view" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "idx_page_view_resource_id" ON "page_view" USING btree ("resource_id");--> statement-breakpoint
ALTER TABLE "page_view" DROP COLUMN "page_key";