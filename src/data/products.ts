import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { product } from '@/db/schema'
import { db } from '@/db'

export const fetchProducts = createServerFn({
  method: 'GET',
}).handler(async () => {
  const products = await db.select().from(product)
  return products
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
  getProducts: () => [...productQueryKeys.all()],
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
export const fetchProductsQueryOptions = queryOptions({
  queryKey: productQueryKeys.all(),
  queryFn: fetchProducts,
})
