import { ProductCard } from './PordcutCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { fakeDataIphoneProducts } from '@/lib/iphones-products'

const IphoneCollection = () => {
  return (
    <section className="py-20 w-full px-4 md:px-8 lg:px-16 bg-white">
      <div className="flex flex-col items-center justify-center gap-25 container w-full mx-auto">
        <h1 className="text-5xl font-bold text-[#1D1D1F] ">
          Newest Iphone Collection
        </h1>
        <Carousel className="w-full blur-lg/10">
          <CarouselContent className="-ml-1 ">
            {fakeDataIphoneProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-1 md:basis-1/2 lg:basis-1/5"
              >
                <div className="p-1">
                  <ProductCard product={product} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="backdrop-blur-sm bg-white/80 shadow-lg border-white/20 hover:bg-white/90" />
          <CarouselNext className="backdrop-blur-sm bg-white/80 shadow-lg border-white/20 hover:bg-white/90" />
        </Carousel>
      </div>
    </section>
  )
}

export default IphoneCollection
