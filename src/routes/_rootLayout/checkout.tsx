import { createFileRoute } from '@tanstack/react-router'
import CheckoutPage from '@/features/checkout/CheckoutPage'

export const Route = createFileRoute('/_rootLayout/checkout')({
  // beforeLoad: async () => {
  //   const headers = getRequestHeaders()
  //   const session = await auth.api.getSession({ headers })

  //   if (!session) {
  //     throw redirect({
  //       to: '/login',
  //       search: { redirect: '/checkout' },
  //     })
  //   }
  // },
  component: RouteComponent,
})

function RouteComponent() {
  return <CheckoutPage />
}
