import { PenIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'
import { Separator } from '@/components/ui/separator'

const ProductReviews = () => {
  return (
    <div className="grid grid-cols-5 gap-6">
      <section className="flex flex-col gap-4 max-w-lg col-span-3">
        {Array.from({ length: 100 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <h4 className="text-foreground font-semibold text-sm">
                John Doe
              </h4>
            </div>

            <div className="flex items-center gap-4">
              <Rating value={5} readOnly />
              <Separator orientation="vertical" className="h-5!" />
              <span className="text-sm text-gray-500">March 15, 2023</span>
              <Separator orientation="vertical" className="h-5!" />

              <Button variant="outline" size="sm" className="bg-transparent">
                Helpful
              </Button>
            </div>
            <p className="text-foreground text-sm">
              This product exceeded my expectations! The build quality is
              excellent, and it performs flawlessly. Highly recommended for
              anyone in need of a reliable and efficient solution.
            </p>
          </div>
        ))}
      </section>
      <div className="flex flex-col gap-4 col-span-2">
        <div>
          {' '}
          <h1 className="text-foreground font-medium text-xl uppercase">
            Review this product
          </h1>
          <p className="text-sm text-heading">
            Share your thoughts with other customers by writing a review. Your
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent inline-flex max-w-xs h-10"
        >
          <PenIcon className="mr-2 h-4 w-4" /> Write a Customer Review
        </Button>
      </div>
    </div>
  )
}

export default ProductReviews
