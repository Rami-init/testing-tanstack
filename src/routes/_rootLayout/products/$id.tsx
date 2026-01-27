import { createFileRoute } from '@tanstack/react-router'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
      <section className="flex flex-col gap-4 rounded-2xl border p-6 border-gray-200 bg-white">
        <Tabs defaultValue="Description">
          <TabsList
            variant="line"
            className="w-fit mb-4 justify-center mx-auto"
          >
            <TabsTrigger
              value="Description"
              className="uppercase data-[state=active]:text-primary data-[state=active]:bg-gray-100 font-bold text-base"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="Review"
              className="uppercase data-[state=active]:text-primary data-[state=active]:bg-gray-100 font-bold text-base"
            >
              Reviews
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Description">
            <ProductDescription />
          </TabsContent>
          <TabsContent value="Review">
            <ProductReviews />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  )
}
