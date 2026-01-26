import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import type { InferSelectModel } from 'drizzle-orm'
import { category } from '@/db/schema'
import { db } from '@/db'

export const fetchCategories = createServerFn({
  method: 'GET',
}).handler(async () => {
  const categories = await db.select().from(category)
  return categories
})
export type SelectCategory = InferSelectModel<typeof category>
export const categoryQueryKeys = {
  all: () => ['categories'],
  getCategories: () => [...categoryQueryKeys.all()],
}
export const fetchCategoriesQueryOPtions = queryOptions({
  queryKey: categoryQueryKeys.all(),
  queryFn: fetchCategories,
})
