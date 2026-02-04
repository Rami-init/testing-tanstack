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

export const address = pgTable('address', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  address1: varchar('address_1', { length: 200 }).notNull(),
  address2: varchar('address_2', { length: 200 }),
  city: varchar('city', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

// Relations for address
export const addressRelations = relations(address, ({ one }) => ({
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
}))

export type Address = InferSelectModel<typeof address>
export type NewAddress = InferInsertModel<typeof address>
