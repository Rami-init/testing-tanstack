import { redirect } from '@tanstack/react-router'
import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from '@/lib/auth'

export const authMiddleware = createMiddleware().server(
  async ({ next, context }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })

    if (!session) {
      throw redirect({ to: '/login' })
    }

    return await next({
      context: {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        ...(context || {}),
        user: {
          ...session.user,
        },
      },
    })
  },
)
export const getUserId = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(({ context }) => {
    if (!context.user.id) {
      throw redirect({ to: '/login' })
    }

    return context.user.id
  })

export const getUser = createServerFn({
  method: 'GET',
})
  .middleware([authMiddleware])
  .handler(({ context }) => {
    if (!context.user.id) {
      throw redirect({ to: '/login' })
    }

    return context.user
  })
