ALTER TYPE "public"."order_status" ADD VALUE 'declined';--> statement-breakpoint
ALTER TABLE "payment_method" ALTER COLUMN "card_number" SET DATA TYPE varchar(19);--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "remote_ip" varchar(45);--> statement-breakpoint
ALTER TABLE "payment_method" ADD COLUMN "cvc" varchar(4) NOT NULL DEFAULT '000';