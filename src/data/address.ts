import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { authMiddleware } from './auth-guard'
import { addressSchema } from '@/schema/address'
import { address } from '@/db/schema'
import { db } from '@/db'

export const fetchAddress = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const addresses = await db
      .select()
      .from(address)
      .where(eq(address.userId, context.user.id))
      .orderBy(address.id)
    return addresses
  })
export const fetchDefaultAddress = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const [defaultAddress] = await db
      .select()
      .from(address)
      .where(
        and(eq(address.userId, context.user.id), eq(address.isDefault, true)),
      )
      .limit(1)
    return defaultAddress
  })
export const createAddress = createServerFn({
  method: 'POST',
})
  .inputValidator(addressSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: payload, context }) => {
    const userId = context.user.id
    // Use transaction to ensure atomicity
    const result = await db.transaction(async (tx) => {
      // If the new address is set as default, unset all other defaults for this user and type
      if (payload.isDefault) {
        await tx
          .update(address)
          .set({ isDefault: false })
          .where(eq(address.userId, userId))
      }

      // Insert the new address
      const [newAddress] = await tx
        .insert(address)
        .values({
          ...payload,
          userId,
          isDefault: payload.isDefault,
        })
        .returning()

      return newAddress
    })

    return result
  })
const idSchema = z.object({ id: z.number().int().positive() })
export const deleteAddress = createServerFn({
  method: 'POST',
})
  .inputValidator(idSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: payload, context }) => {
    const userId = context.user.id

    // Delete the address if it belongs to the user
    await db
      .delete(address)
      .where(and(eq(address.id, payload.id), eq(address.userId, userId)))

    return { success: true }
  })
export const updateAddress = createServerFn({
  method: 'POST',
})
  .inputValidator(idSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: payload, context }) => {
    const userId = context.user.id

    // Use transaction to ensure atomicity
    const result = await db.transaction(async (tx) => {
      // If the updated address is set as default, unset all other defaults for this user
      const results = await tx
        .select()
        .from(address)
        .where(and(eq(address.id, payload.id), eq(address.userId, userId)))
        .limit(1)

      if (results.length === 0) {
        throw new Error('Address not found or does not belong to user')
      }
      await tx
        .update(address)
        .set({
          isDefault: false,
        })
        .where(and(eq(address.userId, userId), eq(address.isDefault, true)))
      return await tx
        .update(address)
        .set({
          isDefault: true,
        })
        .where(and(eq(address.id, payload.id), eq(address.userId, userId)))
        .returning()
    })
    return result
  })
export const addressQueryKeys = {
  all: () => ['addresses'],
  getAddresses: () => [...addressQueryKeys.all()],
}

export const fetchAddressQueryOptions = () =>
  queryOptions({
    queryKey: addressQueryKeys.all(),
    queryFn: () => fetchAddress(),
  })
export const fetchDefaultAddressQueryOptions = () =>
  queryOptions({
    queryKey: [...addressQueryKeys.all(), 'default'],
    queryFn: () => fetchDefaultAddress(),
  })
