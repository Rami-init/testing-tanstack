import { createFileRoute } from '@tanstack/react-router'
import { fetchProductsQueryOptions } from '@/data/products'
import CategoriesFilter from '@/features/products/CategoriesFilter'
import NavFilter from '@/features/products/NavFilter'
import Products from '@/features/products/Products'

export const Route = createFileRoute('/_rootLayout/products/')({
  component: ProductsPage,
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(fetchProductsQueryOptions)
  },
})

function ProductsPage() {
  return (
    <div className="flex w-full flex-1 container mx-auto gap-4 py-6">
      <CategoriesFilter />
      <main className="flex flex-col w-full gap-5">
        <NavFilter />
        <Products />
      </main>
    </div>
  )
}
