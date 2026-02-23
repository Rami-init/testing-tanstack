import { useNavigate } from '@tanstack/react-router'
import {
  ChevronDownIcon,
  HeartPlus,
  MinusIcon,
  PlusIcon,
  ShoppingBasketIcon,
  ShoppingCart,
} from 'lucide-react'

import { motion } from 'motion/react'
import { useState } from 'react'
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
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/whishlist'

const ProductDetails = ({ product }: { product: ProductWithRelations }) => {
  const addItemToCart = useCartStore((state) => state.addItem)
  const { toggleItem, isExisting } = useWishlistStore((state) => state)
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [addToCartClicked, setAddToCartClicked] = useState(false)
  const [buyNowClicked, setBuyNowClicked] = useState(false)

  const handleQuantityChange = (value: number) => {
    if (value < 1) {
      setQuantity(1)
    } else if (value > 99) {
      setQuantity(99)
    } else {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    addItemToCart(product, quantity)
    setAddToCartClicked(true)
    setTimeout(() => setAddToCartClicked(false), 600)
  }
  const handleAddToWishlist = () => {
    toggleItem(product)
  }
  const handleBuyNow = () => {
    addItemToCart(product, quantity)
    setBuyNowClicked(true)
    setTimeout(() => {
      setBuyNowClicked(false)
      navigate({ from: '/products/$id', to: '/products/cart' })
    }, 600)
  }
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
                <Button
                  variant="ghost"
                  className="p-0 m-0"
                  onClick={() => handleQuantityChange(quantity - 1)}
                >
                  <MinusIcon />
                </Button>
              </InputGroupAddon>
              <motion.div
                key={`quantity-${quantity}`}
                initial={{ scale: 1.2, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 25,
                  duration: 0.3,
                }}
                className="flex-1"
              >
                <InputGroupInput
                  id="inline-end-input"
                  type="number"
                  placeholder="Quantity"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(Number(e.target.value))}
                  min={1}
                  max={99}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </motion.div>
              <InputGroupAddon align="inline-end">
                <Button
                  variant="ghost"
                  className="p-0 m-0"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <PlusIcon />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </FieldSet>
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="h-12 text-primary border-primary hover:bg-primary/10 hover:text-primary font-bold w-full"
              variant="outline"
              onClick={handleAddToCart}
            >
              <motion.div
                animate={
                  addToCartClicked
                    ? {
                        y: [-50, 0],
                        opacity: [0, 1],
                        rotate: [180, 0],
                        scale: [0.5, 1.2, 1],
                      }
                    : {}
                }
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <ShoppingCart />
              </motion.div>
              <span className="text-base">Add to Cart</span>
            </Button>
          </motion.div>
        </div>
        <div className="flex items-center gap-2.5">
          <motion.div
            className="flex-1"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className="h-10 font-bold w-full flex-1"
              onClick={handleBuyNow}
            >
              <motion.div
                animate={
                  buyNowClicked
                    ? {
                        scale: [1, 1.5, 0.8, 1.2, 1],
                        rotate: [0, 360],
                      }
                    : {}
                }
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <ShoppingBasketIcon />
              </motion.div>
              <span className="text-base">Buy Now</span>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              className={cn(
                'h-10 font-bold w-full',
                isExisting(product.id)
                  ? 'bg-green-600 text-white hover:bg-green-700 border-green-700'
                  : 'text-primary border-primary hover:bg-primary/10 hover:text-primary',
              )}
              variant={isExisting(product.id) ? 'default' : 'outline'}
              onClick={handleAddToWishlist}
            >
              <motion.div
                animate={
                  isExisting(product.id)
                    ? {
                        scale: [1, 1.5, 0.8, 1.2, 1],
                        rotate: [0, 360],
                      }
                    : {
                        scale: 1,
                        rotate: 0,
                      }
                }
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                <HeartPlus />
              </motion.div>
            </Button>
          </motion.div>
        </div>
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
