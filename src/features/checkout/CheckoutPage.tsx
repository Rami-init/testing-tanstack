import { zodResolver } from '@hookform/resolvers/zod'
import {
  Check,
  CreditCard,
  MapPin,
  Plus,
  ShieldCheck,
  Truck,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { AddressSchema, CardSchema, CheckoutFormSchema } from './schemas'
import type {
  AddressFormValues,
  CardFormValues,
  CheckoutFormValues,
} from './schemas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const mockItems = [
  {
    id: '1',
    title: 'iPhone 13 Pro',
    price: 999,
    image: '/category/images/iphone/iphone-13-1.avif',
  },
  {
    id: '2',
    title: 'iPhone 17 Max',
    price: 1299,
    image: '/category/images/iphone/iphone-17-1.avif',
  },
]

const savedAddressSeed: Array<AddressFormValues> = [
  {
    street: '123 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94103',
    country: 'United States',
  },
  {
    street: '55 King St',
    city: 'Toronto',
    state: 'ON',
    zip: 'M5H 1H1',
    country: 'Canada',
  },
]

const countries = ['United States', 'Canada', 'United Kingdom', 'Germany']

const createAddressId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

type SavedAddress = AddressFormValues & { id: string; label: string }

const formatAddressLabel = (address: AddressFormValues) =>
  `${address.street}, ${address.city}`

const mapToSaved = (address: AddressFormValues): SavedAddress => ({
  id: createAddressId(),
  label: formatAddressLabel(address),
  ...address,
})

const CheckoutPage = () => {
  const [billingAddresses, setBillingAddresses] = useState<Array<SavedAddress>>(
    savedAddressSeed.map(mapToSaved),
  )
  const [shippingAddresses] = useState<Array<SavedAddress>>(
    savedAddressSeed.map(mapToSaved),
  )

  const [selectedBillingId, setSelectedBillingId] = useState(
    billingAddresses[0]?.id ?? '',
  )
  const [selectedShippingId] = useState(shippingAddresses[0]?.id ?? '')

  const [billingDialogOpen, setBillingDialogOpen] = useState(false)
  const [cardDialogOpen, setCardDialogOpen] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CardFormValues | null>(null)

  const billingAddress = useMemo(
    () => billingAddresses.find((item) => item.id === selectedBillingId),
    [billingAddresses, selectedBillingId],
  )
  const shippingAddress = useMemo(
    () => shippingAddresses.find((item) => item.id === selectedShippingId),
    [shippingAddresses, selectedShippingId],
  )

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema),
    mode: 'onChange',
    defaultValues: {
      billingAddress: billingAddresses[0],
      shipToDifferentAddress: false,
      shippingAddress: undefined,
      orderNotes: '',
    },
  })

  const billingForm = useForm<AddressFormValues>({
    resolver: zodResolver(AddressSchema),
    defaultValues: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: countries[0],
    },
    mode: 'onChange',
  })

  const cardForm = useForm<CardFormValues>({
    resolver: zodResolver(CardSchema),
    defaultValues: {
      cardNumber: '',
      expiry: '',
      cvc: '',
      holderName: '',
    },
    mode: 'onChange',
  })

  const onSubmit = (data: CheckoutFormValues) => {
    const payload = {
      ...data,
      billingAddress,
      shippingAddress: data.shipToDifferentAddress
        ? shippingAddress
        : billingAddress,
      selectedCard,
    }
    console.log('Place order', payload)
  }

  const handleBillingSelect = (id: string) => {
    setSelectedBillingId(id)
    const selected = billingAddresses.find((item) => item.id === id)
    if (selected) {
      form.setValue('billingAddress', selected, { shouldValidate: true })
    }
  }

  const handleAddBilling = (data: AddressFormValues) => {
    const next = mapToSaved(data)
    setBillingAddresses((prev) => [...prev, next])
    setSelectedBillingId(next.id)
    form.setValue('billingAddress', next, { shouldValidate: true })
    billingForm.reset({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: countries[0],
    })
    setBillingDialogOpen(false)
  }

  const handleSaveCard = (data: CardFormValues) => {
    setSelectedCard(data)
    cardForm.reset({ cardNumber: '', expiry: '', cvc: '', holderName: '' })
    setCardDialogOpen(false)
  }

  const subtotal = mockItems.reduce((sum, item) => sum + item.price, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-8">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Billing Address</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <RadioGroup
                value={selectedBillingId}
                onValueChange={handleBillingSelect}
                className="gap-4"
              >
                {billingAddresses.map((address) => (
                  <label
                    key={address.id}
                    className="flex items-start justify-between rounded-lg border border-gray-200 p-4 transition hover:border-[#3858d6]"
                  >
                    <div className="flex gap-3">
                      <RadioGroupItem value={address.id} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {address.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {address.city}, {address.state} {address.zip}
                        </p>
                      </div>
                    </div>
                    <Check className="mt-1 size-4 text-[#3858d6]" />
                  </label>
                ))}
              </RadioGroup>

              <Dialog
                open={billingDialogOpen}
                onOpenChange={setBillingDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button type="button" className="w-fit bg-[#3858d6]">
                    <Plus className="mr-2 size-4" /> Add New Address
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-xl">
                  <DialogHeader>
                    <DialogTitle>Add Billing Address</DialogTitle>
                    <DialogDescription>
                      Save a new billing address to your account.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={billingForm.handleSubmit(handleAddBilling)}
                    className="grid gap-4"
                  >
                    <div className="grid gap-3">
                      <Label htmlFor="billing-street">Street</Label>
                      <Input
                        id="billing-street"
                        placeholder="123 Market Street"
                        {...billingForm.register('street')}
                      />
                      {billingForm.formState.errors.street?.message && (
                        <p className="text-xs text-red-500">
                          {billingForm.formState.errors.street.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-3">
                        <Label htmlFor="billing-city">City</Label>
                        <Input
                          id="billing-city"
                          placeholder="San Francisco"
                          {...billingForm.register('city')}
                        />
                        {billingForm.formState.errors.city?.message && (
                          <p className="text-xs text-red-500">
                            {billingForm.formState.errors.city.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="billing-state">State</Label>
                        <Input
                          id="billing-state"
                          placeholder="CA"
                          {...billingForm.register('state')}
                        />
                        {billingForm.formState.errors.state?.message && (
                          <p className="text-xs text-red-500">
                            {billingForm.formState.errors.state.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-3">
                        <Label htmlFor="billing-zip">ZIP</Label>
                        <Input
                          id="billing-zip"
                          placeholder="94103"
                          {...billingForm.register('zip')}
                        />
                        {billingForm.formState.errors.zip?.message && (
                          <p className="text-xs text-red-500">
                            {billingForm.formState.errors.zip.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="billing-country">Country</Label>
                        <Controller
                          control={billingForm.control}
                          name="country"
                          render={({ field }) => (
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {billingForm.formState.errors.country?.message && (
                          <p className="text-xs text-red-500">
                            {billingForm.formState.errors.country.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-[#3858d6]">
                        Save Address
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {selectedCard ? (
                <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="size-5 text-[#3858d6]" />
                    <div>
                      <p className="text-sm font-semibold">
                        Visa ending in {selectedCard.cardNumber.slice(-4)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires {selectedCard.expiry}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCardDialogOpen(true)}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-muted-foreground">
                  No card selected. Add a payment method.
                </div>
              )}

              <Dialog open={cardDialogOpen} onOpenChange={setCardDialogOpen}>
                <DialogTrigger asChild>
                  <Button type="button" className="w-fit bg-[#3858d6]">
                    <CreditCard className="mr-2 size-4" /> Add Card
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add Payment Method</DialogTitle>
                    <DialogDescription>
                      Securely store your card for this order.
                    </DialogDescription>
                  </DialogHeader>
                  <form
                    onSubmit={cardForm.handleSubmit(handleSaveCard)}
                    className="grid gap-4"
                  >
                    <div className="grid gap-3">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="4242 4242 4242 4242"
                        {...cardForm.register('cardNumber')}
                      />
                      {cardForm.formState.errors.cardNumber?.message && (
                        <p className="text-xs text-red-500">
                          {cardForm.formState.errors.cardNumber.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="grid gap-3">
                        <Label htmlFor="card-expiry">Expiry</Label>
                        <Input
                          id="card-expiry"
                          placeholder="MM/YY"
                          {...cardForm.register('expiry')}
                        />
                        {cardForm.formState.errors.expiry?.message && (
                          <p className="text-xs text-red-500">
                            {cardForm.formState.errors.expiry.message}
                          </p>
                        )}
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="card-cvc">CVC</Label>
                        <Input
                          id="card-cvc"
                          placeholder="123"
                          {...cardForm.register('cvc')}
                        />
                        {cardForm.formState.errors.cvc?.message && (
                          <p className="text-xs text-red-500">
                            {cardForm.formState.errors.cvc.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="card-holder">Cardholder Name</Label>
                      <Input
                        id="card-holder"
                        placeholder="Alex Johnson"
                        {...cardForm.register('holderName')}
                      />
                      {cardForm.formState.errors.holderName?.message && (
                        <p className="text-xs text-red-500">
                          {cardForm.formState.errors.holderName.message}
                        </p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-[#3858d6]">
                        Save Card
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <div className="flex items-center gap-3 rounded-lg bg-[#f1f4ff] p-4 text-xs text-[#3858d6]">
                <ShieldCheck className="size-4" /> Secure payments with 128-bit
                encryption.
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Additional Info</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="orderNotes">Order Notes (Optional)</Label>
              <Textarea
                id="orderNotes"
                placeholder="Add delivery instructions, gate codes, or preferences."
                className="mt-3"
                {...form.register('orderNotes')}
              />
              {form.formState.errors.orderNotes?.message && (
                <p className="mt-2 text-xs text-red-500">
                  {form.formState.errors.orderNotes.message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <OrderSummary
          items={mockItems}
          subtotal={subtotal}
          tax={tax}
          total={total}
        />
      </div>
    </form>
  )
}

const OrderSummary = ({
  items,
  subtotal,
  tax,
  total,
}: {
  items: Array<{ id: string; title: string; price: number; image: string }>
  subtotal: number
  tax: number
  total: number
}) => {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="size-14 rounded-lg border border-gray-200 object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">Qty 1</p>
              </div>
              <p className="text-sm font-semibold text-foreground">
                ${item.price.toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold text-foreground">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button type="submit" className="h-12 w-full bg-[#3858d6] text-base">
          Place Order
        </Button>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="size-4" /> Free shipping over $500
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4" /> Deliver in 2-4 days
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CheckoutPage
