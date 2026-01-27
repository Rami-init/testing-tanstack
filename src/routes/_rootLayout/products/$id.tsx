import { createFileRoute } from '@tanstack/react-router'
import ProductDescription from '@/features/product/ProductDescription'
import ProductDetails from '@/features/product/ProductDetails'
import ProductReviews from '@/features/product/ProductReviews'
import ProductView from '@/features/product/ProductView'

export const Route = createFileRoute('/_rootLayout/products/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="flex flex-col gap-4 py-12 container mx-auto flex-1">
      <section className="grid grid-cols-5 gap-8">
        <ProductView />
        <ProductDetails />
      </section>
      <section className="flex flex-col gap-4 rounded-2xl border p-4 border-gray-200">
        <ProductDescription />
        <ProductReviews />
      </section>
    </main>
  )
}
