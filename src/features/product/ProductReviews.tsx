import { format } from 'date-fns'
import { ArrowDownCircleIcon, PenIcon } from 'lucide-react'
import { toast } from 'sonner'
import type { ProductWithRelations } from '@/db/schema'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Rating } from '@/components/ui/rating'
import { Separator } from '@/components/ui/separator'

const ProductReviews = ({ product }: { product: ProductWithRelations }) => {
  const reviews = product.reviews
  const totalReviews = product.reviewsCounts || 0
  console.log('Product Reviews:', product.customerReviews)
  function handleWriteReview() {
    toast.warning('Thanks — you can write a review after delivery.', {
      description:
        "We'll notify you by email once your order is delivered so you can share your experience.",
      duration: 4000,
    })
  }

  return (
    <div className="grid grid-cols-5 gap-6">
      <div className="flex flex-col gap-3 col-span-3">
        <section className="flex flex-col gap-4 max-w-lg ">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="flex flex-col gap-2.5 border-b pb-4 last:border-0"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={review.authorImage ?? ''} />
                  <AvatarFallback>{review.author?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h4 className="text-foreground font-semibold text-sm">
                  {review.author}
                </h4>
              </div>

              <div className="flex items-center gap-4">
                <Rating value={Number(review.rating)} readOnly />
                <Separator orientation="vertical" className="h-5!" />
                <span className="text-sm text-gray-500">
                  {format(new Date(review.createdAt), 'MMMM d, yyyy')}
                </span>
                <Separator orientation="vertical" className="h-5!" />

                <Button variant="outline" size="sm" className="bg-transparent">
                  Helpful
                </Button>
              </div>
              <div>
                <h3 className="text-foreground font-semibold text-base capitalize">
                  {review.title}
                </h3>
                <p className="text-foreground text-sm">{review.content}</p>
              </div>
            </div>
          ))}
        </section>
        <p className="text-primary font-semibold hover:underline cursor-pointer inline-flex items-center gap-1">
          <ArrowDownCircleIcon className="h-5 w-5" /> Load More Reviews
        </p>
      </div>
      <div className="flex flex-col gap-4 col-span-2">
        <div>
          <h2 className="text-foreground font-medium text-2xl">
            Customer Reviews
          </h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-4xl font-bold text-foreground">
              {product.rating}
            </span>
            <Rating value={Number(product.rating)} readOnly />
            <span className="text-sm text-gray-500">
              ({product.reviewsCounts} reviews)
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2.5 mt-6">
          {product.customerReviews?.map((cr, index) => (
            <CustomerReviewRating
              key={index}
              title={cr.title}
              count={parseInt(cr.description)}
              totalReviews={totalReviews}
            />
          ))}
        </div>
        <div className="flex flex-col gap-2.5 mt-6">
          <h3 className="text-foreground font-semibold text-base">
            Customers Says
          </h3>
          <p className="text-sm text-heading">
            {product.customerSays ||
              'No customer feedback available at the moment.'}
          </p>
        </div>
        <div>
          {' '}
          <h1 className="text-foreground font-medium text-xl ">
            Review This Product
          </h1>
          <p className="text-sm text-heading">
            Share your thoughts with other customers by writing a review. Your
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent inline-flex max-w-xs h-10"
          onClick={handleWriteReview}
        >
          <PenIcon className="mr-2 h-4 w-4" /> Write a Customer Review
        </Button>
      </div>
    </div>
  )
}
const CustomerReviewRating = ({
  title,
  count,
  totalReviews,
}: {
  title: string
  count: number
  totalReviews: number
}) => {
  console.log(
    'Total Reviews in CustomerReviewRating:',
    totalReviews,
    count,
    title,
  )

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500">{title}</span>
      <div className="w-32 bg-gray-200 rounded-full h-4 grow overflow-hidden">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{ width: `${count}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-500 min-w-8">{count}%</span>
    </div>
  )
}
export default ProductReviews
