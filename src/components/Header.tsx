import { Link } from '@tanstack/react-router'
import { CircleUser, Heart, ShoppingCart } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Separator } from './ui/separator'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'
import { authClient } from '@/lib/auth-client'

const linksList = [
  { name: 'Home', to: '/' },
  { name: 'Products', to: '/products' },
  { name: 'About', to: '/about' },
  { name: 'Contact', to: '/contact' },
]
const Header = () => {
  return (
    <header className="flex items-center justify-between fixed bg-background w-full top-0 left-0 right-0 h-16 shadow-md z-10">
      <div className="container mx-auto flex items-center justify-between h-full">
        <Link to="/" className="flex items-center">
          <img
            src="./logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="inline-block mr-1"
          />
          <h1 className="text-base font-medium text-heading">ex-iphones</h1>
        </Link>
        <ul className="flex text-heading font-bold text-base h-full">
          {linksList.map((link) => (
            <LinkItem key={link.to} to={link.to}>
              {link.name}
            </LinkItem>
          ))}
        </ul>
        <LoginLink />
      </div>
    </header>
  )
}
export const LoginLink = () => {
  const session = authClient.useSession()
  const isLogin = Boolean(session.data?.user)
  const cartCount = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )
  return (
    <div className="flex items-center gap-x-4 h-full">
      {isLogin ? (
        <Link
          to="/profile"
          className="text-base font-semibold text-heading flex items-center gap-x-1 cursor-pointer"
        >
          <span>Welcome, {session.data?.user.name}</span>{' '}
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

      <Heart className="text-heading cursor-pointer" />
      <Link to="/products/cart" className="relative">
        <ShoppingCart className="text-heading cursor-pointer" />
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
    </div>
  )
}

const LinkItem = ({
  to,
  children,
  className,
}: {
  to: string
  children: string
  className?: string
}) => (
  <Link
    to={to}
    className={cn(
      'border-b-2 border-transparent hover:border-current px-2 h-full flex items-center hover:text-primary transition cursor-pointer duration-300',
      className,
    )}
    activeProps={{
      className: 'border-b-2 border-primary! text-primary',
    }}
  >
    {children}
  </Link>
)
export default Header
