import { z } from 'zod'

export const addressSchema = z.object({
  address1: z.string().min(3, 'Address line 1 is required'),
  address2: z.string().optional().or(z.literal('')),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  isDefault: z.boolean(),
})
export type AddressFormValues = z.infer<typeof addressSchema>
