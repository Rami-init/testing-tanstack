import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Info, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { trackOrder } from '@/data/checkout'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_rootLayout/profile/track-orders')({
  component: RouteComponent,
})
const trackOrderSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  billingEmail: z.string().email('Invalid email address'),
})

type TrackedOrder = {
  id: number
  status: string
  totalAmount: string
  createdAt: string
  items: Array<{ productId: number; quantity: number; price: string }>
}

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
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const trackOrderFn = useServerFn(trackOrder)

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof trackOrderSchema>>({
    mode: 'onChange',
    defaultValues: {
      orderId: '',
      billingEmail: '',
    },
    resolver: zodResolver(trackOrderSchema),
  })

  const onSubmit = async (data: z.infer<typeof trackOrderSchema>) => {
    setIsLoading(true)
    setTrackedOrder(null)
    try {
      const result = await trackOrderFn({ data })
      setTrackedOrder(result as TrackedOrder)
      toast.success('Order found!')
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to track order',
      )
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="flex flex-col gap-10 flex-1">
      <div className="flex gap-4 flex-col">
        <h2 className="text-2xl font-semibold text-foreground">
          Track Your Orders
        </h2>
        <p className="text-heading text-sm font-normal md:col-span-2 max-w-prose">
          To track your order please enter your Order ID in the box below and
          press the "Track" button. This was given to you on your receipt and in
          the confirmation email you should have received.
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <div className="flex gap-6">
                <Controller
                  control={control}
                  name="orderId"
                  render={({ field }) => (
                    <Field data-invalid={!!errors.orderId}>
                      <FieldLabel htmlFor="track-order">
                        Track Your Order
                      </FieldLabel>
                      <FieldContent>
                        <Input
                          id="track-order"
                          type="text"
                          placeholder="E.g. 1234ABCD"
                          className="bg-white"
                          aria-invalid={!!errors.orderId}
                          required
                          {...field}
                        />
                        <FieldDescription>
                          <Info className="inline mr-1 mb-1 h-4 w-4 text-gray-500" />
                          Order ID is a combination of numbers and letters found
                          in your order confirmation email.
                        </FieldDescription>
                        {errors.orderId && (
                          <FieldError>{errors.orderId.message}</FieldError>
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  name="billingEmail"
                  control={control}
                  render={({ field }) => (
                    <Field data-invalid={!!errors.billingEmail}>
                      <FieldLabel>Billing Email</FieldLabel>
                      <Input
                        id="billing-email"
                        type="email"
                        placeholder="E.g. example@example.com"
                        className="bg-white"
                        aria-invalid={!!errors.billingEmail}
                        required
                        {...field}
                      />
                      {errors.billingEmail && (
                        <FieldError>{errors.billingEmail.message}</FieldError>
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>
          </FieldSet>
          <Button
            disabled={!isValid || isLoading}
            type="submit"
            className="mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tracking...
              </>
            ) : (
              'Track Order'
            )}
          </Button>
        </form>

        {trackedOrder && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
            <h3 className="text-lg font-semibold mb-4">Order Details</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium">#{trackedOrder.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span
                  className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[trackedOrder.status] ?? ''}`}
                >
                  {trackedOrder.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-medium">
                  ${Number(trackedOrder.totalAmount).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">
                  {new Date(trackedOrder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {trackedOrder.items.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Items</p>
                <div className="space-y-2">
                  {trackedOrder.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between text-sm border-b border-gray-100 pb-1"
                    >
                      <span>
                        Product #{item.productId} × {item.quantity}
                      </span>
                      <span>${Number(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
