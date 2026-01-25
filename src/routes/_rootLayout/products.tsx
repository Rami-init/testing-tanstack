import { createFileRoute } from '@tanstack/react-router'
import CategoriesFilter from '@/features/producst/CategoriesFilter'
import NavFilter from '@/features/producst/NavFilter'

export const Route = createFileRoute('/_rootLayout/products')({
  component: ProductsPage,
})

function ProductsPage() {
  return (
    <div className="flex w-full flex-1 container mx-auto gap-4 py-6">
      <CategoriesFilter />
      <main className="flex flex-col w-full">
        <NavFilter />
        <section>Products List</section>
      </main>
    </div>
  )
}
