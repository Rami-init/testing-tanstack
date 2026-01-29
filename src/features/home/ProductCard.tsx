import { Link } from '@tanstack/react-router'
import type { Product } from '@/db/schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="border-0 shadow-none bg-transparent ">
      <CardContent className="flex aspect-square items-center justify-center p-6">
        <div className="flex flex-col gap-y-3 text-center">
          <img
            src={product.thumbnail || ''}
            alt={product.title}
            className="w-auto h-40 mx-auto"
          />
          <span className="text-[#BF4800] font-bold text-xs">New</span>
          <div>
            <h4 className="text-xl font-bold whitespace-nowrap truncate max-w-fit">
              {product.model?.slice(0, 20) ||
                product.title.slice(6, 20).toUpperCase()}
            </h4>
            <h6 className="text-sm font-bold text-[#1D1D1F]">
              From ${product.price}
            </h6>
          </div>
          <Button className="px-8" asChild>
            <Link
              to="/products/$id"
              params={{
                id: String(product.id),
              }}
            >
              Buy Now
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
