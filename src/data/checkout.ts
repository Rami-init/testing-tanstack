import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { and, eq, ne, or } from 'drizzle-orm'
import { z } from 'zod'
import { authMiddleware } from './auth-guard'
import type { CartItem } from '@/store/cart'
import { address, order, orderItem, paymentMethod } from '@/db/schema'
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
  billingAddressId: z.number().int().positive(),
  shippingAddressId: z.number().int().positive().optional(),
  paymentMethodId: z.number().int().positive(),
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  orderNotes: z.string().max(500).optional(),
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

    // Get client IP address
    const headers = getRequestHeaders()
    const remoteIp =
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      headers.get('x-real-ip') ??
      '127.0.0.1'

    // Verify the billing address belongs to the user
    const [billingAddress] = await db
      .select()
      .from(address)
      .where(eq(address.id, payload.billingAddressId))
      .limit(1)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!billingAddress || billingAddress.userId !== userId) {
      throw new Error('Invalid billing address')
    }

    // Verify the shipping address if different from billing
    if (payload.shippingAddressId) {
      const [shippingAddress] = await db
        .select()
        .from(address)
        .where(eq(address.id, payload.shippingAddressId))
        .limit(1)

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!shippingAddress || shippingAddress.userId !== userId) {
        throw new Error('Invalid shipping address')
      }
    }

    // Verify the payment method belongs to the user
    const [selectedPaymentMethod] = await db
      .select()
      .from(paymentMethod)
      .where(eq(paymentMethod.id, payload.paymentMethodId))
      .limit(1)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!selectedPaymentMethod || selectedPaymentMethod.userId !== userId) {
      throw new Error('Invalid payment method')
    }

    // Calculate totals
    const subtotal = payload.items.reduce((total, item) => {
      const price = Number(item.extractedPrice ?? 0)
      return total + price * item.quantity
    }, 0)

    // Shipping: FREE if subtotal > $1000, otherwise based on method
    const shipping =
      subtotal > 1000
        ? 0
        : payload.shippingMethod === 'express'
          ? 29.0
          : payload.shippingMethod === 'overnight'
            ? 49.0
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
          billingAddressId: payload.billingAddressId,
          shippingAddressId:
            payload.shippingAddressId ?? payload.billingAddressId,
          paymentMethodId: payload.paymentMethodId,
          orderNotes: payload.orderNotes,
          status: 'pending',
          totalAmount: totalAmount.toFixed(2),
          remoteIp,
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

    return {
      success: true,
      orderId: result.id,
      totalAmount,
      message: 'Order placed successfully!',
    }
  })

// Process payment - checks if first order by user account + remote IP
const processPaymentSchema = z.object({
  orderId: z.number().int().positive(),
})

export const processPayment = createServerFn({
  method: 'POST',
})
  .inputValidator((data) => processPaymentSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data: payload, context }) => {
    const userId = context.user.id

    // Get client IP address
    const headers = getRequestHeaders()
    const remoteIp =
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      headers.get('x-real-ip') ??
      '127.0.0.1'

    // Get the current order
    const [currentOrder] = await db
      .select()
      .from(order)
      .where(eq(order.id, payload.orderId))
      .limit(1)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!currentOrder || currentOrder.userId !== userId) {
      throw new Error('Order not found')
    }

    // Check if user has any previous orders (by account OR remote IP) excluding the current one
    const previousOrders = await db
      .select({ id: order.id })
      .from(order)
      .where(
        and(
          ne(order.id, payload.orderId),
          or(eq(order.userId, userId), eq(order.remoteIp, remoteIp)),
        ),
      )
      .limit(1)

    const isFirstPayment = previousOrders.length === 0

    if (isFirstPayment) {
      // First payment - mark as paid (success)
      await db
        .update(order)
        .set({ status: 'paid' })
        .where(eq(order.id, payload.orderId))

      return {
        success: true,
        status: 'paid' as const,
        orderId: payload.orderId,
        message: 'Payment approved! Your order has been confirmed.',
      }
    } else {
      // Already has orders - decline payment
      await db
        .update(order)
        .set({ status: 'declined' })
        .where(eq(order.id, payload.orderId))

      return {
        success: false,
        status: 'declined' as const,
        orderId: payload.orderId,
        message:
          'Payment declined. Your card has been declined by the payment processor.',
      }
    }
  })

// Fetch a single order by ID
const fetchOrderSchema = z.object({
  orderId: z.number().int().positive(),
})

export const fetchOrder = createServerFn({
  method: 'GET',
})
  .inputValidator((data) => fetchOrderSchema.parse(data))
  .middleware([authMiddleware])
  .handler(async ({ data: payload, context }) => {
    const [result] = await db
      .select()
      .from(order)
      .where(
        and(eq(order.id, payload.orderId), eq(order.userId, context.user.id)),
      )
      .limit(1)

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!result) {
      throw new Error('Order not found')
    }

    return result
  })
