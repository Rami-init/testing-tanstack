import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute } from '@tanstack/react-router'
import {
  Building2,
  Globe,
  Hash,
  Home,
  MapPin,
  Phone,
  Plus,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

type Address = {
  id: string
  fullName: string
  address1: string
  address2?: string
  city: string
  state?: string
  postalCode: string
  country: string
  phone: string
}

type AddressFormValues = Omit<Address, 'id'>

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  address1: z.string().min(3, 'Address line 1 is required'),
  address2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().optional(),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().min(7, 'Phone number is required'),
})

const emptyAddressForm: AddressFormValues = {
  fullName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
}

export const Route = createFileRoute('/_rootLayout/profile/address')({
  component: RouteComponent,
})

function RouteComponent() {
  const [shippingAddresses, setShippingAddresses] = useState<Array<Address>>([
    {
      id: createId(),
      fullName: 'Alex Johnson',
      address1: '123 Market St',
      address2: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94103',
      country: 'United States',
      phone: '+1 415 555 0198',
    },
  ])

  const [defaultShippingId, setDefaultShippingId] = useState(
    shippingAddresses[0]?.id ?? '',
  )

  const [billingAddresses, setBillingAddresses] = useState<Array<Address>>([
    {
      id: createId(),
      fullName: 'Alex Johnson',
      address1: '55 King St',
      address2: 'Suite 100',
      city: 'Toronto',
      state: 'ON',
      postalCode: 'M5H 1H1',
      country: 'Canada',
      phone: '+1 647 555 0123',
    },
  ])

  const [defaultBillingId, setDefaultBillingId] = useState(
    billingAddresses[0]?.id ?? '',
  )

  const [shippingDialogOpen, setShippingDialogOpen] = useState(false)
  const [billingDialogOpen, setBillingDialogOpen] = useState(false)

  const shippingForm = useForm<AddressFormValues>({
    defaultValues: emptyAddressForm,
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
  })

  const billingForm = useForm<AddressFormValues>({
    defaultValues: emptyAddressForm,
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
  })

  const addShippingAddress = (data: AddressFormValues) => {
    const next = { id: createId(), ...data }
    setShippingAddresses((prev) => [...prev, next])
    if (!defaultShippingId) {
      setDefaultShippingId(next.id)
    }
    shippingForm.reset(emptyAddressForm)
    setShippingDialogOpen(false)
  }

  const addBillingAddress = (data: AddressFormValues) => {
    const next = { id: createId(), ...data }
    setBillingAddresses((prev) => [...prev, next])
    if (!defaultBillingId) {
      setDefaultBillingId(next.id)
    }
    billingForm.reset(emptyAddressForm)
    setBillingDialogOpen(false)
  }

  return (
    <div className="container mx-auto flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Shipping addresses</CardTitle>
          <CardDescription>
            Manage multiple shipping locations and choose the default.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <RadioGroup
            value={defaultShippingId}
            onValueChange={setDefaultShippingId}
            className="gap-4"
          >
            <Accordion type="single" collapsible className="w-full">
              {shippingAddresses.map((address) => (
                <AccordionItem key={address.id} value={address.id}>
                  <AccordionTrigger>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{address.fullName}</span>
                        {defaultShippingId === address.id && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {address.address1}, {address.city}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium text-foreground">
                          {address.fullName}
                        </div>
                        <div>{address.address1}</div>
                        {address.address2 && <div>{address.address2}</div>}
                        <div>
                          {address.city}
                          {address.state ? `, ${address.state}` : ''}{' '}
                          {address.postalCode}
                        </div>
                        <div>{address.country}</div>
                        <div>{address.phone}</div>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <RadioGroupItem
                          value={address.id}
                          id={`shipping-${address.id}`}
                        />
                        Default shipping
                      </label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </RadioGroup>
        </CardContent>
        <CardFooter className="border-t">
          <Dialog
            open={shippingDialogOpen}
            onOpenChange={setShippingDialogOpen}
          >
            <DialogTrigger asChild>
              <Button type="button" className="ml-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add shipping address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add shipping address</DialogTitle>
                <DialogDescription>
                  Add a new shipping address and select it as default if needed.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={shippingForm.handleSubmit(addShippingAddress)}
                className="grid gap-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    control={shippingForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="shipping-fullName">
                          Full name
                        </FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <User />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="shipping-fullName"
                              placeholder="Alex Johnson"
                              {...field}
                            />
                          </InputGroup>
                          <FieldError>
                            {shippingForm.formState.errors.fullName?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    control={shippingForm.control}
                    name="phone"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="shipping-phone">Phone</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <Phone />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="shipping-phone"
                              placeholder="+1 555 555 555"
                              {...field}
                            />
                          </InputGroup>
                          <FieldError>
                            {shippingForm.formState.errors.phone?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  control={shippingForm.control}
                  name="address1"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="shipping-address1">
                        Address line 1
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Home />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="shipping-address1"
                            placeholder="123 Market St"
                            {...field}
                          />
                        </InputGroup>
                        <FieldError>
                          {shippingForm.formState.errors.address1?.message}
                        </FieldError>
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  control={shippingForm.control}
                  name="address2"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="shipping-address2">
                        Address line 2
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Building2 />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="shipping-address2"
                            placeholder="Apt 4B"
                            {...field}
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  )}
                />
                <div className="grid gap-4 md:grid-cols-3">
                  <Controller
                    control={shippingForm.control}
                    name="city"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="shipping-city">City</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <MapPin />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="shipping-city"
                              placeholder="San Francisco"
                              {...field}
                            />
                          </InputGroup>
                          <FieldError>
                            {shippingForm.formState.errors.city?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    control={shippingForm.control}
                    name="state"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="shipping-state">State</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <MapPin />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="shipping-state"
                              placeholder="CA"
                              {...field}
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    control={shippingForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="shipping-postal">
                          Postal code
                        </FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <Hash />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="shipping-postal"
                              placeholder="94103"
                              {...field}
                            />
                          </InputGroup>
                          <FieldError>
                            {shippingForm.formState.errors.postalCode?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  control={shippingForm.control}
                  name="country"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="shipping-country">
                        Country
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Globe />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="shipping-country"
                            placeholder="United States"
                            {...field}
                          />
                        </InputGroup>
                        <FieldError>
                          {shippingForm.formState.errors.country?.message}
                        </FieldError>
                      </FieldContent>
                    </Field>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => shippingForm.reset(emptyAddressForm)}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    disabled={!shippingForm.formState.isValid}
                  >
                    Save address
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Billing addresses</CardTitle>
          <CardDescription>
            Save billing details and choose your default billing address.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <RadioGroup
            value={defaultBillingId}
            onValueChange={setDefaultBillingId}
            className="gap-4"
          >
            <Accordion type="single" collapsible className="w-full">
              {billingAddresses.map((address) => (
                <AccordionItem key={address.id} value={address.id}>
                  <AccordionTrigger>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{address.fullName}</span>
                        {defaultBillingId === address.id && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-xs">
                        {address.address1}, {address.city}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="text-sm text-muted-foreground">
                        <div className="font-medium text-foreground">
                          {address.fullName}
                        </div>
                        <div>{address.address1}</div>
                        {address.address2 && <div>{address.address2}</div>}
                        <div>
                          {address.city}
                          {address.state ? `, ${address.state}` : ''}{' '}
                          {address.postalCode}
                        </div>
                        <div>{address.country}</div>
                        <div>{address.phone}</div>
                      </div>
                      <label className="flex items-center gap-2 text-sm">
                        <RadioGroupItem
                          value={address.id}
                          id={`billing-${address.id}`}
                        />
                        Default billing
                      </label>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </RadioGroup>
        </CardContent>
        <CardFooter className="border-t">
          <Dialog open={billingDialogOpen} onOpenChange={setBillingDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="ml-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add billing address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add billing address</DialogTitle>
                <DialogDescription>
                  Add a new billing address and select it as default if needed.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={billingForm.handleSubmit(addBillingAddress)}
                className="grid gap-4"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Controller
                    control={billingForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="billing-fullName">
                          Full name
                        </FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <User />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="billing-fullName"
                              placeholder="Alex Johnson"
                              {...field}
                            />
                          </InputGroup>
                          <FieldError>
                            {billingForm.formState.errors.fullName?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    control={billingForm.control}
                    name="phone"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="billing-phone">Phone</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <Phone />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="billing-phone"
                              placeholder="+1 555 555 555"
                              {...field}
                            />
                          </InputGroup>
                          <FieldError>
                            {billingForm.formState.errors.phone?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  control={billingForm.control}
                  name="address1"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="billing-address1">
                        Address line 1
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Home />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="billing-address1"
                            placeholder="55 King St"
                            {...field}
                          />
                        </InputGroup>
                        <FieldError>
                          {billingForm.formState.errors.address1?.message}
                        </FieldError>
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  control={billingForm.control}
                  name="address2"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="billing-address2">
                        Address line 2
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Building2 />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="billing-address2"
                            placeholder="Suite 100"
                            {...field}
                          />
                        </InputGroup>
                      </FieldContent>
                    </Field>
                  )}
                />
                <div className="grid gap-4 md:grid-cols-3">
                  <Controller
                    control={billingForm.control}
                    name="city"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="billing-city">City</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <MapPin />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="billing-city"
                              placeholder="Toronto"
                              {...field}
                            />
                          </InputGroup>
                          <FieldError>
                            {billingForm.formState.errors.city?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    control={billingForm.control}
                    name="state"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="billing-state">State</FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <MapPin />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="billing-state"
                              placeholder="ON"
                              {...field}
                            />
                          </InputGroup>
                        </FieldContent>
                      </Field>
                    )}
                  />
                  <Controller
                    control={billingForm.control}
                    name="postalCode"
                    render={({ field }) => (
                      <Field>
                        <FieldLabel htmlFor="billing-postal">
                          Postal code
                        </FieldLabel>
                        <FieldContent>
                          <InputGroup>
                            <InputGroupAddon>
                              <Hash />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="billing-postal"
                              placeholder="M5H 1H1"
                              {...field}
                            />
                          </InputGroup>
                          <FieldError>
                            {billingForm.formState.errors.postalCode?.message}
                          </FieldError>
                        </FieldContent>
                      </Field>
                    )}
                  />
                </div>
                <Controller
                  control={billingForm.control}
                  name="country"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="billing-country">Country</FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <Globe />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="billing-country"
                            placeholder="Canada"
                            {...field}
                          />
                        </InputGroup>
                        <FieldError>
                          {billingForm.formState.errors.country?.message}
                        </FieldError>
                      </FieldContent>
                    </Field>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => billingForm.reset(emptyAddressForm)}
                  >
                    Clear
                  </Button>
                  <Button
                    type="submit"
                    disabled={!billingForm.formState.isValid}
                  >
                    Save address
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  )
}
