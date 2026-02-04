import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import {
  Building2,
  Globe,
  Hash,
  Home,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import type { UserWithAddresses } from '@/data/user'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { PersonalInfoAvatar } from '@/components/UploadFile'
import { updateUser, userAddressQueryKeys } from '@/data/user'
import { authClient } from '@/lib/auth-client'

const accountSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),

  mobile: z.string().trim().min(7, 'Invalid mobile number').optional(),
  country: z
    .string()
    .min(2, 'Please enter the country you are currently residing in'),
  state: z
    .string()
    .min(2, 'Please enter the state you are currently residing in'),
  city: z
    .string()
    .min(2, 'Please enter the city you are currently residing in'),
  address: z.string().min(5, 'Please enter your address'),
  postalCode: z.string().optional(),
  addressLine2: z.string().optional(),
})

type AccountSchema = z.infer<typeof accountSchema>

const AccountSettingsForm = ({
  user,
}: {
  user: NonNullable<UserWithAddresses>
}) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const updateUserFn = useServerFn(updateUser)

  // Get the default address (first address or default address)
  const defaultAddress =
    user.addresses.find((addr) => addr.isDefault) || user.addresses[0]

  const form = useForm<AccountSchema>({
    resolver: zodResolver(accountSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user.name ? user.name.split(' ')[0] : '',
      lastName: user.name ? user.name.split(' ')[1] : '',
      email: user.email || '',
      mobile: user.mobile || '',
      country: defaultAddress.country || '',
      state: defaultAddress.state || '',
      city: defaultAddress.city || '',
      address: defaultAddress.address1 || '',
      postalCode: defaultAddress.postalCode || '',
      addressLine2: defaultAddress.address2 || '',
    },
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = form

  const updateUserMutation = useMutation({
    mutationFn: (data: AccountSchema) =>
      updateUserFn({
        data: {
          name: `${data.firstName} ${data.lastName}`,
          mobile: data.mobile,
          address: {
            address1: data.address,
            address2: data.addressLine2,
            city: data.city,
            state: data.state,
            country: data.country,
            postalCode: data.postalCode,
          },
        },
      }),
    onSuccess: async () => {
      // Invalidate user queries
      await queryClient.invalidateQueries({
        queryKey: userAddressQueryKeys.all(),
      })

      // Refresh Better Auth session to get updated user data
      await authClient.getSession({ fetchOptions: { cache: 'no-cache' } })

      // Invalidate router to refresh all data
      await router.invalidate()

      toast.success('Account updated successfully')
    },
    onError: (error) => {
      toast.error('Failed to update account', {
        description: error.message || 'An unexpected error occurred.',
      })
    },
  })

  const onSubmit = (data: AccountSchema) => {
    updateUserMutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-6">
      <div className="flex flex-col gap-4">
        <PersonalInfoAvatar image={user.image} />
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="firstName"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="firstName">First name</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <User />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="firstName"
                      placeholder="John"
                      {...field}
                    />
                  </InputGroup>
                  {errors.firstName && (
                    <FieldError>{errors.firstName.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="lastName">Last name</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <User />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="lastName"
                      placeholder="Doe"
                      {...field}
                    />
                  </InputGroup>
                  {errors.lastName && (
                    <FieldError>{errors.lastName.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <Mail />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder="me@example.com"
                      disabled
                      {...field}
                    />
                  </InputGroup>
                  {errors.email && (
                    <FieldError>{errors.email.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={control}
            name="mobile"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="mobile">Mobile</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <Phone />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="mobile"
                      type="tel"
                      placeholder="+1 555 555 555"
                      {...field}
                    />
                  </InputGroup>
                  {errors.mobile && (
                    <FieldError>{errors.mobile.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="country"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="country">Country</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <Globe />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="country"
                      placeholder="Country"
                      {...field}
                    />
                  </InputGroup>
                  {errors.country && (
                    <FieldError>{errors.country.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="state"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="state">State</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <MapPin />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="state"
                      placeholder="State"
                      {...field}
                    />
                  </InputGroup>
                  {errors.state && (
                    <FieldError>{errors.state.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="city">City</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <MapPin />
                    </InputGroupAddon>
                    <InputGroupInput id="city" placeholder="City" {...field} />
                  </InputGroup>
                  {errors.city && (
                    <FieldError>{errors.city.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <Controller
            control={control}
            name="postalCode"
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor="postalCode">Zip Code</FieldLabel>
                <FieldContent>
                  <InputGroup>
                    <InputGroupAddon>
                      <Hash />
                    </InputGroupAddon>
                    <InputGroupInput
                      id="postalCode"
                      placeholder="12345"
                      {...field}
                    />
                  </InputGroup>
                  {errors.postalCode && (
                    <FieldError>{errors.postalCode.message}</FieldError>
                  )}
                </FieldContent>
              </Field>
            )}
          />
          <div className="col-span-2">
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="address">Address</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupAddon>
                        <Home />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="address"
                        placeholder="e.g. Apartment, suite, etc. (optional)"
                        {...field}
                      />
                    </InputGroup>
                    {errors.address && (
                      <FieldError>{errors.address.message}</FieldError>
                    )}
                  </FieldContent>
                </Field>
              )}
            />
          </div>
          <div className="col-span-2">
            <Controller
              control={control}
              name="addressLine2"
              render={({ field }) => (
                <Field>
                  <FieldLabel htmlFor="addressLine2">Address line 2</FieldLabel>
                  <FieldContent>
                    <InputGroup>
                      <InputGroupAddon>
                        <Building2 />
                      </InputGroupAddon>
                      <InputGroupInput
                        id="addressLine2"
                        placeholder="Suite, floor, etc."
                        {...field}
                      />
                    </InputGroup>
                    {errors.addressLine2 && (
                      <FieldError>{errors.addressLine2.message}</FieldError>
                    )}
                  </FieldContent>
                </Field>
              )}
            />
          </div>

          <div className="py-2">
            <Button
              type="submit"
              disabled={!isValid || updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AccountSettingsForm

export const AccountSettingsFormSkeleton = () => {
  return (
    <div className="p-4 grid gap-4">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
        <div className="col-span-2">
          <Skeleton className="h-20 w-full rounded-md" />
        </div>
        <div className="col-span-2 flex justify-end">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </div>
  )
}
