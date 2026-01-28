import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  json,
  numeric,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { category } from './category.schema'
import type { Category } from './category.schema'

export const product = pgTable('product', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  categoryId: integer('category_id')
    .notNull()
    .references(() => category.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }).notNull(),
  asin: varchar('asin', { length: 50 }).notNull().unique(),
  link: text('link'),
  serpapiLink: text('serpapi_link'),
  thumbnail: text('thumbnail'),
  thumbnails: json('thumbnails').$type<Array<string>>(),
  rating: numeric('rating', { precision: 2, scale: 1 }),
  reviewsCounts: integer('reviews_counts'),
  price: varchar('price', { length: 50 }),
  extractedPrice: numeric('extracted_price', { precision: 10, scale: 2 }),
  oldPrice: varchar('old_price', { length: 50 }),
  extractedOldPrice: numeric('extracted_old_price', {
    precision: 10,
    scale: 2,
  }),
  brand: varchar('brand', { length: 255 }),
  operatingSystem: varchar('operating_system', { length: 100 }),
  memoryRam: varchar('memory_ram', { length: 50 }),
  storage: varchar('storage', { length: 50 }),
  cpuModel: varchar('cpu_model', { length: 100 }),
  cpuSpeed: varchar('cpu_speed', { length: 50 }),
  screenSize: varchar('screen_size', { length: 50 }),
  resolution: varchar('resolution', { length: 50 }),
  model: varchar('model', { length: 255 }),
  description: json('description').$type<Array<string>>(),
  customerSays: text('customer_says'),
  reviewsImages: json('reviews_images').$type<Array<string>>(),
  customerReviews:
    json('customer_reviews').$type<
      Array<{ title: string; description: string }>
    >(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const productReview = pgTable('product_review', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  productId: integer('product_id')
    .notNull()
    .references(() => product.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 500 }),
  content: text('content'),
  rating: numeric('rating', { precision: 2, scale: 1 }),
  author: varchar('author', { length: 255 }),
  authorImage: text('author_image'),
  verifiedPurchase: boolean('verified_purchase').default(false),
  helpful: text('helpful'),
  reviewImages: json('review_images').$type<Array<string>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Relations
export const productRelations = relations(product, ({ one, many }) => ({
  category: one(category, {
    fields: [product.categoryId],
    references: [category.id],
  }),
  reviews: many(productReview),
}))

export const productReviewRelations = relations(productReview, ({ one }) => ({
  product: one(product, {
    fields: [productReview.productId],
    references: [product.id],
  }),
}))

// Types
export type Product = typeof product.$inferSelect
export type NewProduct = typeof product.$inferInsert
export type ProductReview = typeof productReview.$inferSelect
export type NewProductReview = typeof productReview.$inferInsert

// Product with relations
export type ProductWithRelations = Product & {
  category: Category
  reviews: Array<ProductReview>
}
