import { z } from 'zod'

export const ContactFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
  email: z.email('Invalid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  subject: z.enum(['General Inquiry', 'Support', 'Feedback', 'Other']),
})
export type ContactFormType = z.infer<typeof ContactFormSchema>
