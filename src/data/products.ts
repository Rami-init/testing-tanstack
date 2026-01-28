import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { and, asc, count, desc, eq, gte, ilike, lte } from 'drizzle-orm'
import { z } from 'zod'
import type { SQL } from 'drizzle-orm'
import { product } from '@/db/schema'
import { db } from '@/db'

export const SortBySchema = z.enum([
  'price-low-high',
  'price-high-low',
  'newest',
  'best-selling',
  'rating',
  'featured',
])

export type SortBy = z.infer<typeof SortBySchema>

export const ProductFiltersSchema = z.object({
  categoryId: z.number().optional(),
  search: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  sortBy: SortBySchema.optional().default('featured'),
  page: z.number().min(1).optional().default(1),
})

export type ProductFilters = z.infer<typeof ProductFiltersSchema>

const PAGE_SIZE = 20

export const fetchProducts = createServerFn({
  method: 'GET',
})
  .inputValidator(
    (input?: ProductFilters): ProductFilters =>
      ProductFiltersSchema.parse(input ?? {}),
  )
  .handler(async ({ data: filters }) => {
    const conditions: Array<SQL> = []

    // Category filter
    if (filters.categoryId) {
      conditions.push(eq(product.categoryId, filters.categoryId))
    }

    // Search filter (title)
    if (filters.search) {
      conditions.push(ilike(product.title, `%${filters.search}%`))
    }

    // Price range filter
    if (filters.minPrice !== undefined) {
      conditions.push(gte(product.extractedPrice, String(filters.minPrice)))
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(product.extractedPrice, String(filters.maxPrice)))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    // Sort order
    let orderBy
    switch (filters.sortBy) {
      case 'price-low-high':
        orderBy = asc(product.extractedPrice)
        break
      case 'price-high-low':
        orderBy = desc(product.extractedPrice)
        break
      case 'newest':
        orderBy = desc(product.createdAt)
        break
      case 'best-selling':
        orderBy = desc(product.reviewsCounts)
        break
      case 'rating':
        orderBy = desc(product.rating)
        break
      case 'featured':
      default:
        orderBy = asc(product.id)
        break
    }

    // Pagination
    const page = filters.page
    const offset = (page - 1) * PAGE_SIZE

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(product)
      .where(whereClause)

    // Get products
    const products = await db
      .select()
      .from(product)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(PAGE_SIZE)
      .offset(offset)

    return {
      products,
      total,
      page,
      pageSize: PAGE_SIZE,
      totalPages: Math.ceil(total / PAGE_SIZE),
    }
  })
export const getProductHomePage = createServerFn({
  method: 'GET',
})
  .inputValidator((categoryId?: number) => categoryId ?? 1)
  .handler(async ({ data }) => {
    const categoryId = data

    const products = await db
      .select()
      .from(product)
      .limit(10)
      .where(eq(product.categoryId, categoryId))
    return products
  })
export const fetchProductById = createServerFn({
  method: 'GET',
})
  .inputValidator((id: string) => id)
  .handler(async ({ data }) => {
    const prodId = parseInt(data, 10)
    const existingProduct = await db.query.product.findFirst({
      where: eq(product.id, prodId),
      with: { reviews: true, category: true },
    })
    if (!existingProduct) {
      throw new Error('Product not found')
    }
    return existingProduct
  })
export const productQueryKeys = {
  all: () => ['products'],
  category: (categoryId: number) => [
    ...productQueryKeys.all(),
    'byCategory',
    categoryId,
  ],
  getProducts: (filters?: ProductFilters) => [
    ...productQueryKeys.all(),
    filters,
  ],
  getProductById: (id: string) => [...productQueryKeys.all(), id],
}
export const fetchProductByIdQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: productQueryKeys.getProductById(id),
    queryFn: () => fetchProductById({ data: id }),
    enabled: !!id,
  })
}
export const fetchProductByCategoryIdQueryOptions = (categoryId: number) => {
  return queryOptions({
    queryKey: productQueryKeys.category(categoryId),
    queryFn: () => getProductHomePage({ data: categoryId }),
    enabled: !!categoryId,
  })
}
export const fetchProductsQueryOptions = (filters?: ProductFilters) =>
  queryOptions({
    queryKey: productQueryKeys.getProducts(filters),
    queryFn: () => fetchProducts({ data: filters }),
  })
