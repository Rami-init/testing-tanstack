import { relations } from 'drizzle-orm'
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { user } from './user.schema'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

export const paymentMethod = pgTable('payment_method', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  cardNumber: varchar('card_number', { length: 19 }).notNull(), // Full card number stored
  cardBrand: varchar('card_brand', { length: 50 }).notNull(), // Visa, Mastercard, etc.
  holderName: varchar('holder_name', { length: 100 }).notNull(),
  expiryMonth: varchar('expiry_month', { length: 2 }).notNull(),
  expiryYear: varchar('expiry_year', { length: 2 }).notNull(),
  cvc: varchar('cvc', { length: 4 }).notNull(), // CVC/CVV code
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Relations for payment method
export const paymentMethodRelations = relations(paymentMethod, ({ one }) => ({
  user: one(user, {
    fields: [paymentMethod.userId],
    references: [user.id],
  }),
}))

export type PaymentMethod = InferSelectModel<typeof paymentMethod>
export type NewPaymentMethod = InferInsertModel<typeof paymentMethod>
