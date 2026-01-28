CREATE TABLE "product" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"category_id" integer NOT NULL,
	"title" varchar(500) NOT NULL,
	"asin" varchar(50) NOT NULL,
	"link" text,
	"serpapi_link" text,
	"thumbnail" text,
	"thumbnails" json,
	"rating" numeric(2, 1),
	"reviews_counts" integer,
	"price" varchar(50),
	"extracted_price" numeric(10, 2),
	"old_price" varchar(50),
	"extracted_old_price" numeric(10, 2),
	"brand" varchar(255),
	"operating_system" varchar(100),
	"memory_ram" varchar(50),
	"storage" varchar(50),
	"cpu_model" varchar(100),
	"cpu_speed" varchar(50),
	"screen_size" varchar(50),
	"resolution" varchar(50),
	"model" varchar(255),
	"description" json,
	"customer_says" text,
	"reviews_images" json,
	"customer_reviews" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "product_asin_unique" UNIQUE("asin")
);
--> statement-breakpoint
CREATE TABLE "product_review" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "product_review_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"product_id" integer NOT NULL,
	"title" varchar(500),
	"content" text,
	"rating" numeric(2, 1),
	"date" varchar(100),
	"author" varchar(255),
	"author_image" text,
	"verified_purchase" boolean DEFAULT false,
	"helpful" integer,
	"review_images" json,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;