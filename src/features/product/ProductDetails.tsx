import {
  ChevronDownIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBasketIcon,
  ShoppingCart,
} from 'lucide-react'
import type { ProductWithRelations } from '@/db/schema'
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

const ProductDetails = ({ product }: { product: ProductWithRelations }) => {
  const oldPrice = product.extractedPrice
    ? (Number(product.extractedPrice) + 78).toFixed(2)
    : null
  const discountedPrice = product.extractedPrice || product.price
  const discountPercentage =
    oldPrice && discountedPrice
      ? Math.round(
          ((Number(oldPrice) - Number(discountedPrice)) / Number(oldPrice)) *
            100,
        )
      : 0
  return (
    <section className="flex flex-col gap-2.5 col-span-2">
      <div className="flex gap-2.5 items-center w-full">
        <Rating value={Number(product.rating)} readOnly />
        <p className="font-medium text-sm text-foreground">
          {product.rating} Star Rating
        </p>
        <span className="text-sm text-gray-500">
          ({product.reviewsCounts}) reviews
        </span>
      </div>
      <h1 className="text-xl text-foreground font-medium">{product.title}</h1>
      <div className="grid grid-cols-2 gap-4">
        <CategoryTag name="Brand" content={product.brand} />
        <CategoryTag name="Category" content={product.category.name} />
        <CategoryTag
          name="Availability"
          content="In Stock"
          className="text-green-600"
        />
        <CategoryTag name="Model" content={product.model} />
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-blue-600">${discountedPrice}</p>
          <p className="text-base font-normal text-heading line-through">
            ${oldPrice}
          </p>
        </div>
        <span className="bg-[#FA8232] text-foreground text-sm font-semibold px-2.5 py-0.5 rounded w-fit text-center self-center-safe">
          {discountPercentage}% OFF
        </span>
      </div>
      <Separator className="my-2" />
      <div className="grid grid-cols-2 grid-rows-3 gap-3 flex-1">
        <ProductSpecification
          title="Memory"
          content={
            product.memoryRam ? `${product.memoryRam} RAM` : 'Standard RAM'
          }
        />
        <ProductSpecification
          title="Storage"
          content={
            product.storage ? `${product.storage} Storage` : 'Standard Storage'
          }
        />
        <ProductSpecification
          title="Processor"
          content={
            product.cpuSpeed
              ? `${product.cpuSpeed} Processor`
              : 'Standard Processor'
          }
        />
        <ProductSpecification
          title="CPU Model"
          content={
            product.cpuModel ? `${product.cpuModel}` : 'Standard CPU Model'
          }
        />

        {product.operatingSystem && (
          <ProductSpecification
            title="Operating System"
            content={
              product.operatingSystem
                ? `${product.operatingSystem}`
                : 'Standard Operating System'
            }
            chevron={false}
          />
        )}
        {product.resolution && (
          <ProductSpecification
            title="Resolution"
            content={
              product.resolution
                ? `${product.resolution}`
                : 'Standard Resolution'
            }
            chevron={false}
          />
        )}
      </div>
      <div className="flex flex-col gap-4">
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
  content?: string | null
  className?: string
}) => {
  return (
    <h4 className="flex gap-2">
      <span className="text-sm text-gray-600">{name}:</span>{' '}
      <span className={cn('text-sm text-foreground font-semibold', className)}>
        {content || 'N/A'}
      </span>
    </h4>
  )
}
const ProductSpecification = ({
  title,
  content,
  chevron = true,
}: {
  title: string
  content?: string
  chevron?: boolean
}) => {
  return (
    <section className="flex flex-col gap-2 py-1">
      <h2 className="text-muted-foreground font-normal text-sm ">{title}</h2>
      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border-border">
        <p className="text-foreground text-lg w-full">{content}</p>
        <span className="text-muted-foreground">
          {chevron && <ChevronDownIcon />}
        </span>
      </div>
    </section>
  )
}
export default ProductDetails
