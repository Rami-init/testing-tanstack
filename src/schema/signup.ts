import { z } from 'zod'

export const signupSchema = z
  .object({
    email: z.email('Invalid email address'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(12, 'Password must be at most 12 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(12, 'Password must be at most 12 characters long'),
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be at most 50 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type SignupSchemaType = z.infer<typeof signupSchema>
