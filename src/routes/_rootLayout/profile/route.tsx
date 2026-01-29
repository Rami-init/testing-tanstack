import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
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

export const Route = createFileRoute('/_rootLayout/profile')({
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
    label: 'Account Settings',
    id: 'account-settings',
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
    link: '/shopping-cart',
    label: 'Shopping Cart',
    id: 'shopping-cart',
    icon: <ShoppingCart />,
  },
  {
    link: '/wishlist',
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
  {
    link: '/profile/log-out',
    label: 'Log Out',
    id: 'log-out',
    icon: <LogOut />,
  },
]
function RouteComponent() {
  return (
    <div className="flex-1 gap-8 flex justify-between container mx-auto my-12">
      <aside className="flex flex-col rounded-lg border py-4 bg-white border-gray-300 w-1/5 h-fit">
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
      </aside>
      <Outlet />
    </div>
  )
}
