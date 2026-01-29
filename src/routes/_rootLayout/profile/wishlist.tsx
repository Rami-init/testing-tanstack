import { Link, createFileRoute } from '@tanstack/react-router'
import { XIcon } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { ProductWithRelations } from '@/db/schema'
import CartEmpty from '@/assets/cart-empty-screeen.svg'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { useWishlistStore } from '@/store/whishlist'

export const Route = createFileRoute('/_rootLayout/profile/wishlist')({
  component: RouteComponent,
})

function RouteComponent() {
  const items = useWishlistStore((state) => state.items)

  return (
    <main className="gap-8 py-12 container mx-auto flex-1">
      <section className="bg-white rounded-lg border border-gray-200 h-fit flex flex-col ">
        <h1 className="border-b border-gray-200 p-4 text-foreground text-lg font-semibold">
          Wishlist
        </h1>
        <div className="flex flex-col gap-3 flex-1 w-full">
          <AnimatePresence mode="popLayout">
            {items.length > 0 ? (
              items.map((item) => (
                <WishlistItemCard key={item.id} product={item} />
              ))
            ) : (
              <WishlistEmptyState />
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  )
}

const WishlistItemCard = ({ product }: { product: ProductWithRelations }) => {
  const remove = useWishlistStore((state) => state.removeItem)
  const addItemToCart = useCartStore((state) => state.addItem)
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
      className="flex gap-6 p-4 items-center w-full"
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
        className="text-lg font-semibold text-foreground truncate max-w-xs mr-auto hover:underline hover:text-primary"
      >
        {product.title}
      </Link>
      <p className="text-foreground/80">Price: ${price.toFixed(2)}</p>

      <p className="text-green-600 font-medium bg-green-100 px-2 py-1 rounded-lg">
        In Stock
      </p>
      <motion.div whileTap={{ scale: 0.8 }}>
        <Button onClick={() => addItemToCart(product, 1)}>Add to Cart</Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          variant="ghost"
          className="p-0 m-0 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-lg"
          onClick={() => remove(product.id)}
        >
          <XIcon />
        </Button>
      </motion.div>
    </motion.div>
  )
}
const WishlistEmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <img
        src={CartEmpty}
        alt="Empty Wishlist"
        className="w-64 h-64 mb-6 object-contain"
      />
      <h2 className="text-xl font-semibold mb-2 text-foreground">
        Your Wishlist is Empty
      </h2>
      <p className="text-foreground/80 mb-6">
        Looks like you haven't added anything to your wishlist yet.
      </p>
      <Button
        variant="outline"
        className="h-10 px-4 max-w-42 uppercase bg-white border-primary text-primary font-normal hover:bg-primary/10 hover:text-primary"
        asChild
      >
        <Link to="/products">Explore Products</Link>
      </Button>
    </div>
  )
}
