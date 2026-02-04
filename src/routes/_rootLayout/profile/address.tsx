import { zodResolver } from '@hookform/resolvers/zod'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { ClientOnly, createFileRoute, useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { Building2, Globe, Hash, Home, MapPin, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { Address } from '@/db/schema'
import type { AddressFormValues } from '@/schema/address'
import type { UseFormReturn } from 'react-hook-form'
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
import { Checkbox } from '@/components/ui/checkbox'
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
import { Skeleton } from '@/components/ui/skeleton'
import {
  createAddress,
  deleteAddress,
  fetchAddressQueryOptions,
  updateAddress,
} from '@/data/address'
import { addressSchema } from '@/schema/address'

const emptyAddressForm: AddressFormValues = {
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
}

export const Route = createFileRoute('/_rootLayout/profile/address')({
  loader: ({ context }) => {
    const shippingAddresses = context.queryClient.prefetchQuery(
      fetchAddressQueryOptions(),
    )
    return shippingAddresses
  },
  component: RouteComponent,
})

function RouteComponent() {
  const shippingQuery = useSuspenseQuery(fetchAddressQueryOptions())
  const shippingAddresses = shippingQuery.data

  return (
    <div className="container mx-auto flex flex-col gap-6">
      <AddressSection
        title="Shipping addresses"
        name="shipping"
        description="Save shipping details and choose your default shipping address."
        addresses={shippingAddresses}
      />
    </div>
  )
}

type AddressSectionProps = {
  title: string
  name: 'shipping'
  description: string
  addresses: Array<Address>
}

function AddressSection({
  title,
  description,
  addresses,
  name,
}: AddressSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const queryClient = useQueryClient()
  const createAddressFn = useServerFn(createAddress)
  const deleteAddressFn = useServerFn(deleteAddress)
  const updateAddressFn = useServerFn(updateAddress)
  const router = useRouter()
  const [defaultId, setDefaultId] = useState(
    addresses.find((addr) => addr.isDefault)?.id.toString() || '',
  )
  const form = useForm<AddressFormValues>({
    defaultValues: { ...emptyAddressForm },
    resolver: zodResolver(addressSchema),
    mode: 'onChange',
  })

  const createAddressMutation = useMutation<Address, Error, AddressFormValues>({
    mutationFn: (input) => createAddressFn({ data: input }),
    onSuccess: (newAddress) => {
      // Invalidate and refetch address queries
      queryClient.invalidateQueries({ queryKey: ['addresses'] })

      // Close dialog and reset form
      setDialogOpen(false)
      form.reset({ ...emptyAddressForm })

      // If this is the default address, update the selection
      if (newAddress.isDefault) {
        setDefaultId(newAddress.id.toString())
      }

      // Show success toast
      toast.success('Address added successfully', {
        description: `Your ${name} address has been saved.`,
      })
    },
    onError: (error) => {
      // Show error toast
      toast.error('Failed to add address', {
        description: error.message || 'An unexpected error occurred.',
      })
    },
  })
  const updateAddressMutation = useMutation({
    mutationFn: (input: { id: number }) => updateAddressFn({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
  const deleteAddressMutation = useMutation({
    mutationFn: (input: { id: number }) => deleteAddressFn({ data: input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })
  const handleSubmit = (data: AddressFormValues) => {
    createAddressMutation.mutate(data)
  }
  const handleDefaultChange = (value: string) => {
    if (defaultId !== value) {
      updateAddressMutation.mutate({ id: Number(value) })
      setDefaultId(value)
    }
    setDefaultId(value)
  }
  const handleDelete = (id: number) => {
    deleteAddressMutation.mutate({ id })
    router.invalidate()
  }

  return (
    <ClientOnly
      fallback={
        <div className="flex flex-col gap-4">
          <SkeletonAddressCard />
          <SkeletonAddressCard />
          <SkeletonAddressCard />
        </div>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          {addresses.length > 0 ? (
            <RadioGroup
              value={defaultId}
              onValueChange={handleDefaultChange}
              className="gap-4"
            >
              <Accordion type="single" collapsible className="w-full">
                {addresses.map((address) => (
                  <AccordionItem key={address.id} value={address.id.toString()}>
                    <AccordionTrigger>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {address.address1}
                          </span>
                          {defaultId === address.id.toString() && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                              Default
                            </span>
                          )}
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {address.city}, {address.country}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="text-sm text-muted-foreground">
                          <div className="font-medium text-foreground">
                            {address.address1}
                          </div>
                          {address.address2 && <div>{address.address2}</div>}
                          <div>
                            {address.city}
                            {address.state ? `, ${address.state}` : ''}{' '}
                            {address.postalCode}
                          </div>
                          <div>{address.country}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <label className="flex items-center gap-2 text-sm">
                            <RadioGroupItem
                              value={address.id.toString()}
                              id={`${name}-${address.id}`}
                            />
                            Default {name}
                          </label>
                          {defaultId !== address.id.toString() && (
                            <Button
                              onClick={() => handleDelete(address.id)}
                              variant="destructive"
                              size="icon"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </RadioGroup>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-8">
              No {name} addresses found. Add your first {name} address below.
            </p>
          )}
        </CardContent>
        <CardFooter className="border-t">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="ml-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add {name} address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add {name} address</DialogTitle>
                <DialogDescription>
                  Add a new {name} address and select it as default if needed.
                </DialogDescription>
              </DialogHeader>
              <AddressFormFields
                form={form}
                name={name}
                onSubmit={handleSubmit}
                isPending={createAddressMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </ClientOnly>
  )
}

type AddressFormFieldsProps = {
  form: UseFormReturn<AddressFormValues>
  name: 'shipping'
  onSubmit: (data: AddressFormValues) => void
  isPending: boolean
}

function AddressFormFields({
  form,
  name,
  onSubmit,
  isPending,
}: AddressFormFieldsProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
      <Controller
        control={form.control}
        name="address1"
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={`${name}-address1`}>Address line 1</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupAddon>
                  <Home />
                </InputGroupAddon>
                <InputGroupInput
                  id={`${name}-address1`}
                  placeholder="123 Market St"
                  disabled={isPending}
                  {...field}
                />
              </InputGroup>
              <FieldError>{form.formState.errors.address1?.message}</FieldError>
            </FieldContent>
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="address2"
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={`${name}-address2`}>
              Address line 2 (Optional)
            </FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupAddon>
                  <Building2 />
                </InputGroupAddon>
                <InputGroupInput
                  id={`${name}-address2`}
                  placeholder="Apt 4B"
                  disabled={isPending}
                  {...field}
                />
              </InputGroup>
            </FieldContent>
          </Field>
        )}
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Controller
          control={form.control}
          name="city"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={`${name}-city`}>City</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <MapPin />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={`${name}-city`}
                    placeholder="San Francisco"
                    disabled={isPending}
                    {...field}
                  />
                </InputGroup>
                <FieldError>{form.formState.errors.city?.message}</FieldError>
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="state"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={`${name}-state`}>
                State (Optional)
              </FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <MapPin />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={`${name}-state`}
                    placeholder="CA"
                    disabled={isPending}
                    {...field}
                  />
                </InputGroup>
              </FieldContent>
            </Field>
          )}
        />
        <Controller
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <Field>
              <FieldLabel htmlFor={`${name}-postal`}>Postal code</FieldLabel>
              <FieldContent>
                <InputGroup>
                  <InputGroupAddon>
                    <Hash />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={`${name}-postal`}
                    placeholder="94103"
                    disabled={isPending}
                    {...field}
                  />
                </InputGroup>
                <FieldError>
                  {form.formState.errors.postalCode?.message}
                </FieldError>
              </FieldContent>
            </Field>
          )}
        />
      </div>
      <Controller
        control={form.control}
        name="country"
        render={({ field }) => (
          <Field>
            <FieldLabel htmlFor={`${name}-country`}>Country</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupAddon>
                  <Globe />
                </InputGroupAddon>
                <InputGroupInput
                  id={`${name}-country`}
                  placeholder="United States"
                  disabled={isPending}
                  {...field}
                />
              </InputGroup>
              <FieldError>{form.formState.errors.country?.message}</FieldError>
            </FieldContent>
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="isDefault"
        render={({ field }) => (
          <div className="flex items-center gap-2">
            <Checkbox
              id={`${name}-isDefault`}
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)}
              disabled={isPending}
            />
            <label
              htmlFor={`${name}-isDefault`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Set as default {name} address
            </label>
          </div>
        )}
      />
      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            form.reset({
              ...emptyAddressForm,
            })
          }
          disabled={isPending}
        >
          Clear
        </Button>
        <Button type="submit" disabled={!form.formState.isValid || isPending}>
          {isPending ? 'Saving...' : 'Save address'}
        </Button>
      </DialogFooter>
    </form>
  )
}
const SkeletonAddressCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-1/2" />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex gap-2 ml-auto">
          <Skeleton className="h-8 w-20 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </CardFooter>
    </Card>
  )
}
