import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import { Info } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
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
function RouteComponent() {
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

  const onSubmit = (data: z.infer<typeof trackOrderSchema>) => {
    // Replace with real update call
    console.log('Account updated', data)
    toast.success('Account updated')
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
          <Button disabled={!isValid} type="submit" className="mt-4">
            Track Order
          </Button>
        </form>
      </div>
    </div>
  )
}
