import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { authMiddleware } from './auth-guard'
import type { CartItem } from '@/store/cart'
import { address, order, orderItem } from '@/db/schema'
import { db } from '@/db'

const processOrderSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.number(),
        quantity: z.number().int().positive(),
        extractedPrice: z.union([z.string(), z.number()]).optional(),
      }),
    )
    .min(1),
  shippingAddressId: z.number().int().positive(),
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  paymentMethod: z.enum(['card', 'paypal', 'bank']),
  cardDetails: z
    .object({
      cardNumber: z.string().min(4),
      cardName: z.string().min(2),
      expiryDate: z.string().min(4),
      cvv: z.string().min(3),
    })
    .optional(),
})

export type ProcessOrderInput = z.infer<typeof processOrderSchema> & {
  items: Array<CartItem>
}

export const processOrder = createServerFn({
  method: 'POST',
})
  .inputValidator((data) => processOrderSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data: payload, context }) => {
    if (!context.user.id) {
      throw new Error('Unauthorized: You must be logged in to checkout')
    }

    const userId = context.user.id

    // Verify the shipping address belongs to the user
    const [shippingAddress] = await db
      .select()
      .from(address)
      .where(eq(address.id, payload.shippingAddressId))
      .limit(1)

    if (shippingAddress.userId !== userId) {
      throw new Error('Invalid shipping address')
    }

    // Calculate totals
    const subtotal = payload.items.reduce((total, item) => {
      const price = Number(item.extractedPrice ?? 0)
      return total + price * item.quantity
    }, 0)

    const shipping =
      subtotal > 1000
        ? 0
        : payload.shippingMethod === 'overnight'
          ? 49.0
          : payload.shippingMethod === 'express'
            ? 29.0
            : 19.0

    const discount = 43.0
    const tax = (subtotal + shipping - discount) * 0.08
    const totalAmount = subtotal + shipping - discount + tax

    // Create order in transaction
    const result = await db.transaction(async (tx) => {
      // Create the order
      const [newOrder] = await tx
        .insert(order)
        .values({
          userId,
          shippingAddressId: payload.shippingAddressId,
          status: 'pending',
          totalAmount: totalAmount.toString(),
        })
        .returning()

      // Create order items
      const orderItemsData = payload.items.map((item) => ({
        orderId: newOrder.id,
        productId: item.id,
        quantity: item.quantity,
        price: String(item.extractedPrice ?? '0'),
      }))

      await tx.insert(orderItem).values(orderItemsData)

      return newOrder
    })

    // In a real app, you would:
    // 1. Process payment with payment gateway
    // 2. Send confirmation email
    // 3. Update inventory

    return {
      success: true,
      orderId: result.id,
      totalAmount,
      message: 'Order placed successfully!',
    }
  })
