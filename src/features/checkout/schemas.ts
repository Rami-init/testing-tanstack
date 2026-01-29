import * as z from 'zod'

export const AddressSchema = z.object({
  street: z.string().min(3, 'Street is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(3, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
})

export const CardSchema = z.object({
  cardNumber: z
    .string()
    .min(12, 'Card number is required')
    .regex(/^[0-9 ]+$/, 'Card number must be numeric'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
  cvc: z.string().min(3, 'CVC is required').max(4, 'CVC is invalid'),
  holderName: z.string().min(2, 'Cardholder name is required'),
})

export const CheckoutFormSchema = z
  .object({
    billingAddress: AddressSchema,
    shipToDifferentAddress: z.boolean(),
    shippingAddress: AddressSchema.optional(),
    orderNotes: z.string().max(500, 'Order notes are too long').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.shipToDifferentAddress && !data.shippingAddress) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Shipping address is required',
        path: ['shippingAddress'],
      })
    }
  })

export type AddressFormValues = z.infer<typeof AddressSchema>
export type CardFormValues = z.infer<typeof CardSchema>
export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>
