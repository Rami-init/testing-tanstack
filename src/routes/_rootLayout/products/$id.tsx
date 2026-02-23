import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { fetchProductByIdQueryOptions } from '@/data/products'
import ProductDescription from '@/features/product/ProductDescription'
import ProductDetails from '@/features/product/ProductDetails'
import ProductReviews from '@/features/product/ProductReviews'
import ProductView from '@/features/product/ProductView'

export const Route = createFileRoute('/_rootLayout/products/$id')({
  loader: ({ context, params }) => {
    return context.queryClient.prefetchQuery(
      fetchProductByIdQueryOptions(params.id),
    )
  },
  component: RouteComponent,
})

function RouteComponent() {
  const id = Route.useParams().id
  const productQuery = useSuspenseQuery(fetchProductByIdQueryOptions(id))

  return (
    <main className="flex flex-col gap-8 py-12 container mx-auto flex-1">
      <section className="grid grid-cols-5 gap-8">
        <ProductView product={productQuery.data} />
        <ProductDetails product={productQuery.data} />
      </section>
      <section className="flex flex-col gap-4 rounded-2xl border p-6 border-gray-200 bg-white">
        <Tabs defaultValue="Review">
          <TabsList
            variant="line"
            className="w-fit mb-4 justify-center mx-auto"
          >
            <TabsTrigger
              value="Review"
              className="uppercase data-[state=active]:text-primary data-[state=active]:bg-gray-100 font-bold text-base"
            >
              Reviews
            </TabsTrigger>
            <TabsTrigger
              value="Description"
              className="uppercase data-[state=active]:text-primary data-[state=active]:bg-gray-100 font-bold text-base"
            >
              Description
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Description">
            <ProductDescription product={productQuery.data} />
          </TabsContent>
          <TabsContent value="Review">
            <ProductReviews product={productQuery.data} />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
