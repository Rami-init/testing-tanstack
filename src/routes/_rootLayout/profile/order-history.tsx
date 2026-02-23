import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { fetchUserOrdersQueryOptions } from '@/data/checkout'

export const Route = createFileRoute('/_rootLayout/profile/order-history')({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(fetchUserOrdersQueryOptions())
  },
  component: RouteComponent,
})

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-200 text-green-900',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
  declined: 'bg-red-200 text-red-900',
}

function RouteComponent() {
  const { data: orders } = useSuspenseQuery(fetchUserOrdersQueryOptions())

  return (
    <div className="flex flex-col gap-4 container mx-auto flex-1">
      <section className="bg-white rounded-lg border border-gray-200 h-fit flex flex-col ">
        <Table>
          <TableCaption>
            {orders.length === 0
              ? 'No orders found.'
              : 'A list of your recent orders.'}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">#{o.id}</TableCell>
                <TableCell>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[o.status] ?? ''}`}
                  >
                    {o.status}
                  </span>
                </TableCell>
                <TableCell>{o.paymentLabel}</TableCell>
                <TableCell>
                  {new Date(o.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {o.items.length} item{o.items.length !== 1 ? 's' : ''}
                </TableCell>
                <TableCell className="text-right">
                  ${Number(o.totalAmount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
