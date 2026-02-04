import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { authMiddleware } from './auth-guard'
import { address, user } from '@/db/schema'
import { db } from '@/db'

export const fetchUserAddress = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userWithAddresses = await db.query.user.findFirst({
      where: eq(user.id, context.user.id),
      with: { addresses: true },
    })

    return userWithAddresses
  })

// Type for the user data including addresses
export type UserWithAddresses = Awaited<ReturnType<typeof fetchUserAddress>>

export const userAddressQueryKeys = {
  all: () => ['user', 'addresses'],
  getAddresses: () => [...userAddressQueryKeys.all()],
}

export const fetchUserAddressQueryOptions = () =>
  queryOptions({
    queryKey: userAddressQueryKeys.all(),
    queryFn: () => fetchUserAddress(),
  })

// Schema for updating user and address
const updateUserSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  mobile: z.string().optional(),
  address: z
    .object({
      address1: z.string().min(5, 'Address is required'),
      address2: z.string().optional(),
      city: z.string().min(2, 'City is required'),
      state: z.string().min(2, 'State is required'),
      country: z.string().min(2, 'Country is required'),
      postalCode: z.string().optional(),
    })
    .optional(),
})

export type UpdateUserInput = z.infer<typeof updateUserSchema>

export const updateUser = createServerFn({
  method: 'POST',
})
  .middleware([authMiddleware])
  .inputValidator(updateUserSchema)
  .handler(async ({ data: payload, context }) => {
    const userId = context.user.id

    // Use transaction to update both user and address
    const result = await db.transaction(async (tx) => {
      // Update user information
      const [updatedUser] = await tx
        .update(user)
        .set({
          name: payload.name,
          mobile: payload.mobile,
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId))
        .returning()

      // Update or create address if provided
      if (payload.address) {
        // Find the default address for this user
        const existingAddress = await tx
          .select()
          .from(address)
          .where(and(eq(address.userId, userId), eq(address.isDefault, true)))
          .limit(1)

        if (existingAddress.length > 0) {
          // Update existing default address
          await tx
            .update(address)
            .set({
              ...payload.address,
              updatedAt: new Date(),
            })
            .where(eq(address.id, existingAddress[0].id))
        } else {
          // Create new address if none exists
          const addressData: any = {
            userId,
            address1: payload.address.address1,
            city: payload.address.city,
            state: payload.address.state,
            country: payload.address.country,
            isDefault: true,
          }

          if (payload.address.address2) {
            addressData.address2 = payload.address.address2
          }

          if (payload.address.postalCode) {
            addressData.postalCode = payload.address.postalCode
          }

          await tx.insert(address).values(addressData)
        }
      }

      return updatedUser
    })

    return result
  })
