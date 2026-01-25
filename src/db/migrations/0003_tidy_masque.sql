ALTER TABLE "category" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_slug_unique" UNIQUE("slug");