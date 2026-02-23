import { createFileRoute } from '@tanstack/react-router'
import { fetchAddressQueryOptions } from '@/data/address'
import { getUserId } from '@/data/auth-guard'
import { fetchPaymentMethodsQueryOptions } from '@/data/payment-method'
import CheckoutPage from '@/features/checkout/CheckoutPage'

export const Route = createFileRoute('/_rootLayout/checkout')({
  beforeLoad: async () => {
    const userId = await getUserId()
    return { userId }
  },
  loader: async ({ context }) => {
    // Prefetch addresses and payment methods in parallel
    await Promise.all([
      context.queryClient.prefetchQuery(fetchAddressQueryOptions()),
      context.queryClient.prefetchQuery(fetchPaymentMethodsQueryOptions()),
    ])
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <CheckoutPage />
}
