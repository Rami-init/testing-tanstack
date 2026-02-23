import { Link, createFileRoute } from '@tanstack/react-router'
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import type { CartItem } from '@/store/cart'
import CartEmpty from '@/assets/cart-empty-screeen.svg'
import { Button } from '@/components/ui/button'
import { Field, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/auth-client'
import { useCartStore } from '@/store/cart'

export const Route = createFileRoute('/_rootLayout/products/cart')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className="grid grid-cols-3 gap-8 py-12 container mx-auto flex-1">
      <CartList />
      <CartSummary />
    </main>
  )
}
const CartSummary = () => {
  const session = authClient.useSession()
  const navigate = Route.useNavigate()
  const items = useCartStore((state) => state.items)
  const countItems = useCartStore((state) => state.getTotalItemsCount)
  const [shippingMethod, setShippingMethod] = useState('standard')

  const subtotal = items.reduce((total, item) => {
    const price = Number(item.extractedPrice ?? 0)
    return total + price * item.quantity
  }, 0)

  const hasItems = items.length > 0 && subtotal > 0

  // Shipping logic: FREE if subtotal > $1000, otherwise based on method
  const shipping = !hasItems
    ? 0
    : subtotal > 1000
      ? 0
      : shippingMethod === 'express'
        ? 29.0
        : shippingMethod === 'overnight'
          ? 49.0
          : 19.0

  const discount = hasItems ? 43.0 : 0
  const taxRate = 0.08 // 8% tax
  const tax = hasItems ? (subtotal + shipping - discount) * taxRate : 0
  const totalAmount = hasItems ? subtotal + shipping - discount + tax : 0
  const handleCheckout = () => {
    if (!session.data?.user) {
      navigate({
        to: '/login',
        search: { redirect: '/checkout' },
      })
    } else {
      navigate({ to: '/checkout' })
    }
    // Proceed with checkout logic here
  }
  return (
    <div className="col-span-1 flex flex-col gap-2">
      <aside className=" bg-white rounded-lg border border-gray-200 p-4 h-fit">
        <h1 className="border-b border-gray-200  text-foreground pb-2">
          Cart Total
        </h1>
        <div className="text-foreground/80 flex flex-col gap-3 py-3 text-base">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Shipping</span>
            <span className="text-right">
              {shipping === 0 ? (
                <span className="text-green-600 font-semibold">FREE</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          {subtotal > 0 && (
            <div className="flex flex-col gap-2">
              <RadioGroup
                value={shippingMethod}
                onValueChange={setShippingMethod}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="standard"
                    id="standard"
                    disabled={subtotal > 1000}
                  />
                  <label htmlFor="standard" className="text-sm">
                    Standard ($19.00) - 5-7 days
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="express"
                    id="express"
                    disabled={subtotal > 1000}
                  />
                  <label htmlFor="express" className="text-sm">
                    Express ($29.00) - 2-3 days
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="overnight"
                    id="overnight"
                    disabled={subtotal > 1000}
                  />
                  <label htmlFor="overnight" className="text-sm">
                    Overnight ($49.00) - Next day
                  </label>
                </div>
              </RadioGroup>
              {subtotal > 1000 && (
                <p className="text-xs text-green-600 italic">
                  🎉 Free shipping applied on orders over $1,000!
                </p>
              )}
            </div>
          )}
          <div className="flex justify-between">
            <span>Discount</span>
            <span className="text-green-600">-${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
        <Button
          onClick={handleCheckout}
          className="h-10 px-4 uppercase font-normal w-full"
        >
          Proceed to checkout
        </Button>
      </aside>
      <aside className=" bg-white rounded-lg border border-gray-200 h-fit">
        <h1 className="border-b border-gray-200 p-4 text-foreground">
          Coupon Code
        </h1>
        <div className="p-4 text-foreground">
          <FieldSet className="gap-3">
            <Field>
              <InputGroup>
                <Input placeholder="Enter your coupon code" />
              </InputGroup>
            </Field>
            <Button
              variant="outline"
              className="h-10 px-4 max-w-32 uppercase bg-white border-primary text-primary font-normal hover:bg-primary/10 hover:text-primary"
            >
              Apply Coupon
            </Button>
          </FieldSet>
        </div>
      </aside>
      <aside className=" bg-white rounded-lg border border-gray-200 h-fit">
        <h1 className="border-b border-gray-200 p-4 text-foreground">
          Cart Summary
        </h1>
        <div className="p-4 text-foreground flex flex-col gap-3">
          <div className="flex justify-between">
            <span>Items in Cart</span>
            <span>{countItems()}</span>
          </div>
          <div className="flex justify-between">
            <span>Saved Amount</span>
            <span className="text-green-600">${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Delivery</span>
            <span>
              {shipping === 0
                ? '5-7 Days'
                : shippingMethod === 'overnight'
                  ? 'Next Day'
                  : shippingMethod === 'express'
                    ? '2-3 Days'
                    : '5-7 Days'}
            </span>
          </div>
        </div>
      </aside>
    </div>
  )
}
const CartList = () => {
  const items = useCartStore((state) => state.items)

  return (
    <section className="col-span-2 bg-white rounded-lg border border-gray-200 h-fit">
      <h1 className="border-b border-gray-200 p-4 text-foreground">
        Shopping Cart
      </h1>
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {items.length > 0 ? (
            items.map((item) => <CartItemCard key={item.id} product={item} />)
          ) : (
            <CartEmptyState />
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
const CartItemCard = ({ product }: { product: CartItem }) => {
  const update = useCartStore((state) => state.updateQuantity)
  const remove = useCartStore((state) => state.removeItem)
  const handleQuantityChange = (value: number) => {
    if (value < 1) {
      update(product.id, 1)
    } else if (value > 99) {
      update(product.id, 99)
    } else {
      update(product.id, value)
    }
  }

  const price = Number(product.extractedPrice ?? 0)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -100, height: 0 }}
      animate={{
        opacity: 1,
        x: 0,
        height: 'auto',
      }}
      exit={{
        opacity: 0,
        x: 100,
        height: 0,
        transition: {
          duration: 0.3,
          ease: 'easeInOut',
        },
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      className="flex gap-6 p-4 flex-1 items-center overflow-hidden"
    >
      <img
        src={product.thumbnail ?? ''}
        alt="Product Image"
        className="w-20 h-20 object-contain rounded-lg"
      />

      <Link
        to="/products/$id"
        params={{
          id: String(product.id),
        }}
        className="text-lg font-semibold text-foreground truncate flex-1 hover:underline hover:text-primary"
      >
        {product.title}
      </Link>
      <p className="text-foreground/80">Price: ${price.toFixed(2)}</p>
      <FieldSet className="w-full max-w-36">
        {' '}
        <InputGroup className="bg-white border-gray-300 h-12">
          <InputGroupAddon align="inline-start">
            <Button
              variant="ghost"
              className="p-0 m-0"
              onClick={() => handleQuantityChange(product.quantity - 1)}
            >
              <MinusIcon />
            </Button>
          </InputGroupAddon>
          <motion.div
            key={`quantity-${product.quantity}`}
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
              value={product.quantity}
              onChange={(e) => handleQuantityChange(Number(e.target.value))}
              min={1}
              defaultValue={1}
              max={99}
              className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </motion.div>
          <InputGroupAddon align="inline-end">
            <Button
              variant="ghost"
              className="p-0 m-0"
              onClick={() => handleQuantityChange(product.quantity + 1)}
            >
              <PlusIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </FieldSet>
      <p className="text-foreground/80">
        Subtotal: ${(price * product.quantity).toFixed(2)}
      </p>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          className="p-0 m-0 text-red-600 hover:bg-red-100 hover:text-red-700"
          onClick={() => remove(product.id)}
        >
          <XIcon />
        </Button>
      </motion.div>
    </motion.div>
  )
}
const CartEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <img
        src={CartEmpty}
        alt="Empty Cart"
        className="w-64 h-64 mb-6 object-contain"
      />
      <h2 className="text-xl font-semibold mb-2 text-foreground">
        Your Cart is Empty
      </h2>
      <p className="text-foreground/80 mb-6">
        Looks like you haven't added anything to your cart yet.
      </p>
      <Button
        variant="outline"
        className="h-10 px-4 max-w-42 uppercase bg-white border-primary text-primary font-normal hover:bg-primary/10 hover:text-primary"
        asChild
      >
        <Link to="/products">Start Shopping</Link>
      </Button>
    </div>
  )
}
export default RouteComponent
