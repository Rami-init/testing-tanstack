import type { typeIPhone } from '@/lib/iphones-products'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const ProductCard = ({ product }: { product: typeIPhone }) => {
  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="flex aspect-square items-center justify-center p-6">
        <div className="flex flex-col gap-y-3 text-center">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-50 h-auto mx-auto"
          />
          <span className="text-[#BF4800] font-bold text-xs">New</span>
          <div>
            <h4 className="text-xl font-bold whitespace-nowrap">
              {product.name}
            </h4>
            <h6 className="text-sm font-bold text-[#1D1D1F]">
              From ${product.discountPrice}
            </h6>
          </div>
          <Button className="px-8">Buy Now</Button>
        </div>
      </CardContent>
    </Card>
  )
}
