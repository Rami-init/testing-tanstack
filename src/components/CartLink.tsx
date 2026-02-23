import { Link, useNavigate } from '@tanstack/react-router'
import {
  ChevronDownIcon,
  CircleUser,
  Clock,
  Heart,
  IdCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  ShoppingCart,
  User,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Separator } from './ui/separator'
import type { ComponentType, SVGProps } from 'react'
import { useWishlistStore } from '@/store/whishlist'
import { useCartStore } from '@/store/cart'
import { authClient } from '@/lib/auth-client'

const profileRoutes = [
  { link: '/profile/overview', label: 'Dashboard', icon: LayoutDashboard },
  { link: '/profile/account', label: 'Account', icon: User },
  { link: '/profile/order-history', label: 'Orders', icon: Clock },
  { link: '/profile/track-orders', label: 'Track Orders', icon: MapPin },
  { link: '/profile/wishlist', label: 'Wishlist', icon: Heart },
  { link: '/profile/address', label: 'Address', icon: IdCard },
]

export const LoginLink = () => {
  const session = authClient.useSession()
  const isLogin = Boolean(session.data?.user)
  const navigate = useNavigate()
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )
  const wishlistCount = useWishlistStore((state) => state.items.length)
  return (
    <div className="flex items-center gap-x-4 h-full">
      {isLogin ? (
        <div className="relative group h-full flex items-center">
          <button className="text-base font-semibold text-heading flex items-center gap-x-1 cursor-pointer">
            <span>Welcome, {session.data?.user.name}</span>
            <ChevronDownIcon className="size-4 transition-transform group-hover:rotate-180" />
          </button>
          <div className="absolute top-full right-0 pt-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 z-50">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-48">
              {profileRoutes.map((route) => (
                <Link
                  key={route.link}
                  to={route.link}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-heading hover:bg-primary hover:text-white transition-colors"
                >
                  <route.icon className="size-4" />
                  {route.label}
                </Link>
              ))}
              <Separator className="my-1" />
              <button
                onClick={async () => {
                  await authClient.signOut()
                  await navigate({ to: '/' })
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
              >
                <LogOut className="size-4" />
                Log Out
              </button>
            </div>
          </div>
        </div>
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
