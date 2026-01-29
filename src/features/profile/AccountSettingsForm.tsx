import { zodResolver } from '@hookform/resolvers/zod'
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
  InputGroupTextarea,
} from '@/components/ui/input-group'
import { Separator } from '@/components/ui/separator'
import { PersonalInfoAvatar } from '@/components/UploadFile'

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

const AccountSettingsForm = ({ user }: { user?: any }) => {
  const form = useForm<AccountSchema>({
    resolver: zodResolver(accountSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
      country: user?.country || '',
      state: user?.state || '',
      city: user?.city || '',
      address: user?.address || '',
      postalCode: user?.postalCode || '',
      addressLine2: user?.addressLine2 || '',
    },
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = form

  const onSubmit = (data: AccountSchema) => {
    // Replace with real update call
    console.log('Account updated', data)
    toast.success('Account updated')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-4 gap-6">
      <div className="flex flex-col gap-4">
        <PersonalInfoAvatar />
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
                      <InputGroupAddon align="block-start">
                        <Home />
                      </InputGroupAddon>
                      <InputGroupTextarea
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
            <Button type="submit" disabled={!isValid}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AccountSettingsForm
