import React, { useEffect } from 'react'
import type { CarouselApi } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { fakeDataIphoneProducts } from '@/lib/iphones-products'
import { cn } from '@/lib/utils'

const ProductView = () => {
  const [imageIndex, setImageIndex] = React.useState(
    fakeDataIphoneProducts[0].images[0],
  )
  const [api, setApi] = React.useState<CarouselApi>()
  useEffect(() => {
    if (!api) return
    const onChange = () => {
      console.log('Selected snap index:', api.selectedScrollSnap())
      setImageIndex(fakeDataIphoneProducts[0].images[api.selectedScrollSnap()])
    }

    api.on('select', onChange)

    return () => {
      api.off('select', onChange)
    }
  }, [api])
  return (
    <section className="col-span-3  flex flex-col gap-8">
      <div className="w-full h-126 flex items-center justify-center border bg-white border-gray-200 p-4 rounded-lg transition-transform duration-500">
        <img
          src={imageIndex}
          alt="Main Product Image"
          className="max-h-full object-contain hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="px-12">
        <Carousel setApi={setApi} className="w-full xl:max-w-3xl">
          <CarouselContent>
            {fakeDataIphoneProducts[0].images.map((image, index) => (
              <CarouselItem
                onClick={() =>
                  setImageIndex(fakeDataIphoneProducts[0].images[index])
                }
                key={index}
                className="pl-4 basis-auto"
              >
                <Card
                  className={cn(
                    'h-24 w-24 border p-0 hover:border-primary shadow-none cursor-pointer',
                    imageIndex === image ? 'border-primary' : 'border-gray-200',
                  )}
                >
                  <CardContent className="flex aspect-square items-center justify-center p-0 relative overflow-hidden">
                    <img
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="backdrop-blur-sm bg-primary shadow-lg border-white hover:bg-primary/90 text-white hover:text-white" />
          <CarouselNext className="backdrop-blur-sm bg-primary shadow-lg border-white hover:bg-primary/90 text-white hover:text-white" />
        </Carousel>
      </div>
    </section>
  )
}

export default ProductView
