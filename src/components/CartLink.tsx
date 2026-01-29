import { Link } from '@tanstack/react-router'
import { ChevronDownIcon, CircleUser, Heart, ShoppingCart } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Separator } from './ui/separator'
import type { ComponentType, SVGProps } from 'react'
import { useWishlistStore } from '@/store/whishlist'
import { useCartStore } from '@/store/cart'
import { authClient } from '@/lib/auth-client'

export const LoginLink = () => {
  const session = authClient.useSession()
  const isLogin = Boolean(session.data?.user)
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )
  const wishlistCount = useWishlistStore((state) => state.items.length)
  return (
    <div className="flex items-center gap-x-4 h-full">
      {isLogin ? (
        <Link
          to="/profile/overview"
          className="text-base font-semibold text-heading flex items-center gap-x-1 cursor-pointer"
        >
          <span>Welcome, {session.data?.user.name}</span>{' '}
          <ChevronDownIcon size={16} />
        </Link>
      ) : (
        <Link
          to="/login"
          className="text-base font-semibold text-heading flex items-center gap-x-1 cursor-pointer"
        >
          <span>Login</span>{' '}
          <CircleUser className="text-heading cursor-pointer" />
        </Link>
      )}
      <Separator orientation="vertical" className="h-5! w-0.5! bg-heading" />

      <CartLink
        cartCount={wishlistCount}
        link="/profile/wishlist"
        icon={Heart}
      />
      <CartLink
        cartCount={cartCount}
        link="/products/cart"
        icon={ShoppingCart}
      />
    </div>
  )
}

export const CartLink = ({
  cartCount,
  link,
  icon: Icon,
}: {
  cartCount: number
  link: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
}) => {
  return (
    <Link to={link} className="relative">
      <Icon className="text-heading cursor-pointer" />
      <AnimatePresence mode="popLayout">
        {cartCount > 0 && (
          <motion.span
            key="cart-badge"
            initial={{ y: -40, filter: 'blur(10px)', scale: 0 }}
            animate={{
              y: 0,
              filter: 'blur(0px)',
              scale: 1,
            }}
            exit={{ y: 50, filter: 'blur(10px)', opacity: 0, scale: 0 }}
            transition={{
              duration: 0.5,
              type: 'spring',
              stiffness: 400,
              damping: 20,
            }}
            className="flex items-center justify-center absolute -top-1.5 -right-2.5 rounded-full bg-[#3858D6] text-white text-[12px] p-0.5 size-5"
          >
            <motion.span
              key={cartCount}
              initial={{ y: -10, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              {cartCount}
            </motion.span>
          </motion.span>
        )}
      </AnimatePresence>
    </Link>
  )
}
