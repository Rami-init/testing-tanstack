CREATE TYPE "public"."address_type" AS ENUM('shipping', 'billing');--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "type" SET DEFAULT 'shipping'::"public"."address_type";--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "type" SET DATA TYPE "public"."address_type" USING "type"::"public"."address_type";--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "address_1" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "address_2" SET DATA TYPE varchar(200);--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "city" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "country" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "state" SET DATA TYPE varchar(100);--> statement-breakpoint
ALTER TABLE "address" ALTER COLUMN "postal_code" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "address" DROP COLUMN "full_name";--> statement-breakpoint
ALTER TABLE "address" DROP COLUMN "phone";