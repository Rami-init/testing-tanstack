import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { PasswordInput } from '@/features/auth/Password'
import { Button } from '@/components/ui/button'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>

const ChangePasswordForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = (data: ChangePasswordSchema) => {
    try {
      // TODO: replace with API call to change password
      console.log('Change password', data)
      toast.success('Password changed successfully')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to change password')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
      <Controller
        control={control}
        name="currentPassword"
        render={({ field }) => (
          <PasswordInput
            label="Current password"
            htmlFor="currentPassword"
            {...field}
            errorMessage={errors.currentPassword?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="newPassword"
        render={({ field }) => (
          <PasswordInput
            label="New password"
            htmlFor="newPassword"
            {...field}
            errorMessage={errors.newPassword?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <PasswordInput
            label="Confirm new password"
            htmlFor="confirmPassword"
            {...field}
            errorMessage={errors.confirmPassword?.message}
          />
        )}
      />

      <div className="pt-2">
        <Button type="submit" disabled={!isValid}>
          Change password
        </Button>
      </div>
    </form>
  )
}

export default ChangePasswordForm
