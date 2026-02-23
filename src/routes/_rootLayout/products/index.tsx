import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import {
  ProductFiltersSchema,
  fetchProductsQueryOptions,
} from '@/data/products'
import CategoriesFilter from '@/features/products/CategoriesFilter'
import NavFilter from '@/features/products/NavFilter'
import Products from '@/features/products/Products'

const searchParamsSchema = ProductFiltersSchema.extend({
  categoryId: z.coerce.number().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).optional().default(1),
})

export const Route = createFileRoute('/_rootLayout/products/')({
  head: () => ({
    meta: [
      { title: 'Shop | ex-phonex' },
      {
        name: 'description',
        content:
          'Browse our full collection of premium refurbished smartphones at ex-phonex. Filter by category, price, and more to find your perfect phone.',
      },
      { property: 'og:title', content: 'Shop | ex-phonex' },
      { property: 'og:url', content: 'https://www.ex-phonex.com/products' },
    ],
  }),
  component: ProductsPage,
  validateSearch: searchParamsSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(fetchProductsQueryOptions(deps))
  },
})

function ProductsPage() {
  const filters = Route.useSearch()

  return (
    <div className="flex w-full flex-1 container mx-auto gap-4 py-6">
      <CategoriesFilter filters={filters} />
      <main className="flex flex-col w-full gap-5">
        <NavFilter filters={filters} />
        <Products filters={filters} />
      </main>
    </div>
  )
}
