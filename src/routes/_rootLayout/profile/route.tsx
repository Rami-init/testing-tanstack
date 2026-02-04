import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from '@tanstack/react-router'
import {
  Clock,
  Heart,
  IdCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  ShoppingCart,
  User,
} from 'lucide-react'
import { getUserId } from '@/data/auth-guard'
import { authClient } from '@/lib/auth-client'

export const Route = createFileRoute('/_rootLayout/profile')({
  beforeLoad: async () => {
    const userId = await getUserId()
    return { userId }
  },
  loader: ({ context }) => {
    if (!context.userId) {
      throw new Error('User ID not found')
    }
    return {
      userId: context.userId,
    }
  },
  component: RouteComponent,
})
const routes = [
  {
    link: '/profile/overview',
    label: 'Dashboard Overview',
    id: 'dashboard-overview',
    icon: <LayoutDashboard />,
  },
  {
    link: '/profile/account',
    label: 'Account Details',
    id: 'account-details',
    icon: <User />,
  },
  {
    link: '/profile/order-history',
    label: 'Order History',
    id: 'order-history',
    icon: <Clock />,
  },
  {
    link: '/profile/track-orders',
    label: 'Track Orders',
    id: 'track-orders',
    icon: <MapPin />,
  },
  {
    link: '/products/cart',
    label: 'Shopping Cart',
    id: 'shopping-cart',
    icon: <ShoppingCart />,
  },
  {
    link: '/profile/wishlist',
    label: 'Wishlist',
    id: 'wishlist',
    icon: <Heart />,
  },
  {
    link: '/profile/address',
    label: 'Address',
    id: 'address',
    icon: <IdCard />,
  },
]

function RouteComponent() {
  const navigate = useNavigate()
  return (
    <div className="flex-1 gap-8 flex container mx-auto my-12 overflow-hidden">
      <aside className="flex flex-col rounded-lg border py-4 bg-white border-gray-300 min-w-62.5 h-fit">
        {routes.map((route) => (
          <Link
            key={route.id}
            to={route.link}
            className="flex items-center gap-3 px-6 py-3 hover:bg-primary transition-colors text-heading hover:text-white cursor-pointer"
            activeProps={{ className: 'bg-primary text-white' }}
          >
            {route.icon}
            <span className="font-medium">{route.label}</span>
          </Link>
        ))}
        <button
          key="log-out"
          onClick={async () => {
            await authClient.signOut()
            await navigate({ to: '/' })
          }}
          className="flex items-center gap-3 px-6 py-3 hover:bg-primary transition-colors text-heading hover:text-white cursor-pointer"
        >
          <LogOut />
          <span className="font-medium">Log Out</span>
        </button>
      </aside>
      <Outlet />
    </div>
  )
}
