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

export const Route = createFileRoute('/_rootLayout/profile/order-history')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 container mx-auto flex-1">
      <section className="bg-white rounded-lg border border-gray-200 h-fit flex flex-col ">
        <Table>
          <TableCaption>A list of your recent orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Order ID</TableHead>
              <TableHead className="w-25">Product Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Wireless Headphones</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Credit Card</TableCell>
              <TableCell>2024-06-15</TableCell>
              <TableCell>$250.00</TableCell>
              <TableCell className="text-right">+</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>
    </div>
  )
}
