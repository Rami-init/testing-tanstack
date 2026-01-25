import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { MailIcon, UserIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PasswordInput } from './Password'
import type { SignupSchemaType } from '@/schema/signup'
import GoogleIcon from '@/assets/google-icon.png'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/auth-client'
import { signupSchema } from '@/schema/signup'

export function SignupForm() {
  const navigate = useNavigate()
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<SignupSchemaType>({
    defaultValues: {
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
    mode: 'onChange',
    resolver: zodResolver(signupSchema),
  })
  const onSubmit = async (data: SignupSchemaType) => {
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      fetchOptions: {
        redirect: 'follow',
        onSuccess() {
          toast.success('Signup successful')
          navigate({ to: '/' })
        },
      },
    })
    if (error) {
      toast.error(error.message || 'Signup failed')
    }
  }
  const signInWithGoogle = async () => {
    const data = await authClient.signIn.social({
      provider: 'google',
      callbackURL: 'http://localhost:5173',
    })
    if (data.error) {
      toast.error(data.error.message || 'Google sign-in failed')
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => (
          <Field className="grid gap-2">
            <FieldLabel htmlFor="name" className="text-heading">
              Name
            </FieldLabel>
            <FieldContent>
              <InputGroup className="bg-white">
                <InputGroupInput
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...field}
                />
                <InputGroupAddon>
                  <UserIcon />
                </InputGroupAddon>
              </InputGroup>
              {error?.message && <FieldError>{error.message}</FieldError>}
            </FieldContent>
          </Field>
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor="email" className="text-heading">
              Email
            </FieldLabel>
            <FieldContent>
              <InputGroup className="bg-white">
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="ex@example.com"
                  {...field}
                />
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
              {errors.email && <FieldError>{errors.email.message}</FieldError>}
            </FieldContent>
          </Field>
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <PasswordInput
            label="Password"
            htmlFor="password"
            {...field}
            errorMessage={errors.password?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <PasswordInput
            label="Confirm Password"
            htmlFor="confirmPassword"
            {...field}
            errorMessage={errors.confirmPassword?.message}
          />
        )}
      />

      <Link
        to="/forget-password"
        className="text-base font-semibold text-primary hover:underline text-center"
      >
        Forgot password?
      </Link>
      <Field>
        <Button disabled={!isValid} type="submit">
          Signup
        </Button>
        <div className="flex w-full gap-2 items-center">
          <Separator className="flex-1 mt-3" />
          <span className="text-sm font-semibold text-muted-foreground mt-3">
            OR
          </span>
          <Separator className="flex-1 mt-3" />
        </div>
        <Button
          variant="outline"
          type="button"
          className="bg-border rounded-full text-[#3F434A] hover:bg-gray-200"
          onClick={signInWithGoogle}
        >
          <img
            src={GoogleIcon}
            alt="Google icon"
            width={16}
            height={16}
            className="inline-block mr-1"
          />{' '}
          Login with Google
        </Button>
        <FieldDescription className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold">
            Login now
          </Link>
        </FieldDescription>
      </Field>
    </form>
  )
}
