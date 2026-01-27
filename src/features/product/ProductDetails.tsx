import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBasketIcon,
  ShoppingCart,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FieldSet } from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Rating } from '@/components/ui/rating'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const ProductDetails = () => {
  return (
    <section className="flex flex-col gap-2.5 col-span-2">
      <div className="flex gap-2.5 items-center w-full">
        <Rating value={4} readOnly />
        <p className="font-medium text-sm text-foreground">4.0 Star Rating</p>
        <span className="text-sm text-gray-500">({100}) reviews</span>
      </div>
      <h1 className="text-xl text-foreground font-medium">
        2020 Apple MacBook Pro with Apple M1 Chip (14-inch, 16GB RAM, 1TB SSD
        Storage) - Space Gray
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <CategoryTag name="Brand" content="Apple" />
        <CategoryTag name="Category" content="Laptops" />
        <CategoryTag
          name="Availability"
          content="In Stock"
          className="text-green-600"
        />
        <CategoryTag name="SKU" content="MBP2020M1-16-1TB-SG" />
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-blue-600">${1299.99}</p>
          <p className="text-base font-normal text-heading line-through">
            ${(78 + 1299.99).toFixed(2)}
          </p>
        </div>
        <span className="bg-[#FA8232] text-foreground text-sm font-semibold px-2.5 py-0.5 rounded w-fit text-center self-center-safe">
          10% OFF
        </span>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col gap-4">
        <ProductSpecification title="Memory" content="16 GB Unified Memory" />
        <ProductSpecification title="Storage" content="1 TB SSD Storage" />
        <ProductSpecification
          title="Processor"
          content="Apple M1 Pro chip with 8‑core CPU and 14‑core GPU"
        />
        <div className="flex items-center gap-2.5">
          <FieldSet className="w-full max-w-32">
            {' '}
            <InputGroup className="bg-white border-gray-300 h-12">
              <InputGroupAddon align="inline-start">
                <Button variant="ghost" className="p-0 m-0">
                  <MinusIcon />
                </Button>
              </InputGroupAddon>
              <InputGroupInput
                id="inline-end-input"
                type="number"
                placeholder="Quantity"
                min={1}
                defaultValue={1}
                max={99}
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <InputGroupAddon align="inline-end">
                <Button variant="ghost" className="p-0 m-0">
                  <PlusIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </FieldSet>
          <Button
            className="h-12 text-primary border-primary hover:bg-primary/10 hover:text-primary font-bold flex-1"
            variant="outline"
          >
            <ShoppingCart />
            <span className="text-base">Add to Cart</span>
          </Button>
        </div>
        <Button className="h-10 font-bold">
          <ShoppingBasketIcon />
          <span className="text-base">Buy Now</span>
        </Button>
      </div>
    </section>
  )
}
const CategoryTag = ({
  name,
  content,
  className,
}: {
  name: string
  content: string
  className?: string
}) => {
  return (
    <h4 className="flex gap-2">
      <span className="text-sm text-gray-600">{name}:</span>{' '}
      <span className={cn('text-sm text-foreground font-semibold', className)}>
        {content}
      </span>
    </h4>
  )
}
const ProductSpecification = ({
  title,
  content,
}: {
  title: string
  content: string
}) => {
  return (
    <section className="flex flex-col gap-2 py-1">
      <h2 className="text-muted-foreground font-normal text-sm ">{title}</h2>
      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border-border">
        <p className="text-foreground text-lg w-full">{content}</p>
        <span className="text-muted-foreground">
          <ChevronDownIcon />
        </span>
      </div>
    </section>
  )
}
export default ProductDetails
