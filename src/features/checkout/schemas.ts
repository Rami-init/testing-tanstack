import * as z from 'zod'

// Luhn algorithm for card number validation
const isValidLuhn = (num: string): boolean => {
  const digits = num.replace(/\s/g, '').split('').reverse().map(Number)
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i]
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

// Card form schema for adding new payment methods
export const CardFormSchema = z.object({
  cardNumber: z
    .string()
    .min(12, 'Card number is required')
    .regex(/^[0-9 ]+$/, 'Card number must be numeric')
    .refine(
      (val) => {
        const clean = val.replace(/\s/g, '')
        return clean.length >= 13 && clean.length <= 19
      },
      { message: 'Card number must be between 13 and 19 digits' },
    )
    .refine((val) => isValidLuhn(val), {
      message: 'Invalid card number',
    }),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format')
    .refine(
      (val) => {
        const [month, year] = val.split('/')
        const expMonth = parseInt(month, 10)
        const expYear = parseInt(year, 10) + 2000
        const now = new Date()
        const expDate = new Date(expYear, expMonth)
        return expDate > now
      },
      { message: 'Card has expired' },
    ),
  cvc: z.string().regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits'),
  holderName: z.string().min(2, 'Cardholder name is required'),
  isDefault: z.boolean(),
})

// Main checkout form schema
export const CheckoutFormSchema = z.object({
  billingAddressId: z
    .number()
    .int()
    .positive('Please select a billing address'),
  paymentMethodId: z.number().int().positive('Please select a payment method'),
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  orderNotes: z.string().max(500, 'Order notes are too long').optional(),
})

export type CardFormValues = z.infer<typeof CardFormSchema>
export type CheckoutFormValues = z.infer<typeof CheckoutFormSchema>
