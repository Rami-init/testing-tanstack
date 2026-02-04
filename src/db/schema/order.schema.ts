import { relations } from 'drizzle-orm'
import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { address } from './address.schema'
import { product } from './product.schema'
import { user } from './user.schema'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded',
])

// Order table - references existing user table (text id)
export const order = pgTable('order', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  shippingAddressId: integer('shipping_address_id').references(
    () => address.id,
    { onDelete: 'set null' },
  ),
  status: orderStatusEnum('status').default('pending').notNull(),
  totalAmount: numeric('total_amount', { precision: 12, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Order items table - references existing product table (integer id)
export const orderItem = pgTable('order_item', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  orderId: integer('order_id')
    .notNull()
    .references(() => order.id, { onDelete: 'cascade' }),
  productId: integer('product_id')
    .notNull()
    .references(() => product.id, { onDelete: 'restrict' }),
  quantity: integer('quantity').notNull().default(1),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(), // snapshot price at time of order
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations for order
export const orderRelations = relations(order, ({ one, many }) => ({
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),

  shippingAddress: one(address, {
    fields: [order.shippingAddressId],
    references: [address.id],
    relationName: 'shippingAddress',
  }),
  items: many(orderItem),
}))

// Relations for order items
export const orderItemRelations = relations(orderItem, ({ one }) => ({
  order: one(order, {
    fields: [orderItem.orderId],
    references: [order.id],
  }),
  product: one(product, {
    fields: [orderItem.productId],
    references: [product.id],
  }),
}))

// Types for address and orders

export type Order = InferSelectModel<typeof order>
export type NewOrder = InferInsertModel<typeof order>

export type OrderItem = InferSelectModel<typeof orderItem>
export type NewOrderItem = InferInsertModel<typeof orderItem>
