import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { MailIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PasswordInput } from './Password'
import type { LoginSchemaType } from '@/schema/login'
import GoogleIcon from '@/assets/google-icon.png'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { authClient } from '@/lib/auth-client'
import { loginSchema } from '@/schema/login'

export const LoginForm = () => {
  const navigate = useNavigate()
  const search = useSearch({ strict: false })
  const redirectTo = (search as any).redirect || '/'
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<LoginSchemaType>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
    resolver: zodResolver(loginSchema),
  })
  const onSubmit = async (data: LoginSchemaType) => {
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
      fetchOptions: {
        redirect: 'follow',
        onSuccess() {
          toast.success('Login successful')
          navigate({ to: redirectTo })
        },
      },
    })
    if (error) {
      toast.error(error.message || 'Login failed')
    }
  }
  const signInWithGoogle = async () => {
    const callbackURL =
      redirectTo !== '/'
        ? `${window.location.origin}${redirectTo}`
        : window.location.origin

    const data = await authClient.signIn.social({
      provider: 'google',
      callbackURL,
    })
    if (data.error) {
      toast.error(data.error.message || 'Google sign-in failed')
    }
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <FieldSet>
        <FieldGroup>
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
                      type="email"
                      id="email"
                      placeholder="ex@example.com"
                      {...field}
                    />
                    <InputGroupAddon>
                      <MailIcon />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError>{errors.email?.message}</FieldError>
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
        </FieldGroup>
      </FieldSet>
      <Link
        to="/forget-password"
        className="text-base font-semibold text-primary hover:underline text-center"
      >
        Forgot password?
      </Link>
      <Field>
        <Button type="submit" disabled={!isValid}>
          Login
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
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold">
            Sign up now
          </Link>
        </FieldDescription>
      </Field>
    </form>
  )
}
