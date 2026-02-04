ALTER TABLE "order" DROP CONSTRAINT "order_billing_address_id_address_id_fk";
--> statement-breakpoint
ALTER TABLE "address" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "billing_address_id";--> statement-breakpoint
DROP TYPE "public"."address_type";