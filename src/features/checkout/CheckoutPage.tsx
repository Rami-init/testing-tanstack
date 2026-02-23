import { zodResolver } from '@hookform/resolvers/zod'
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import {
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Globe,
  Hash,
  Home,
  Loader2,
  MapPin,
  Plus,
  ShieldCheck,
  Trash,
  Truck,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CardFormSchema, CheckoutFormSchema } from './schemas'
import type { Address, PaymentMethod } from '@/db/schema'
import type { AddressFormValues } from '@/schema/address'
import type { CartItem } from '@/store/cart'
import type { CardFormValues, CheckoutFormValues } from './schemas'
import amexCardImg from '@/assets/american-express-card.png'
import discoverCardImg from '@/assets/discover-card.png'
import jcbCardImg from '@/assets/jcb-card.png'
import mastercardCardImg from '@/assets/mastercard-card.png'
import unionpayCardImg from '@/assets/unionpay-card.png'
import visaCardImg from '@/assets/visa-card.png'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Input } from '@/components/ui/input'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import {
  createAddress,
  deleteAddress,
  fetchAddressQueryOptions,
  updateAddress,
} from '@/data/address'
import { processOrder, processPayment } from '@/data/checkout'
import {
  createPaymentMethod,
  deletePaymentMethod,
  fetchPaymentMethodsQueryOptions,
  setDefaultPaymentMethod,
} from '@/data/payment-method'
import { addressSchema } from '@/schema/address'
import { useCartStore } from '@/store/cart'

const emptyAddressForm: AddressFormValues = {
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
}

// Detect card brand from card number
const detectCardBrand = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s/g, '')
  if (/^4/.test(cleanNumber)) return 'Visa'
  if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard'
  if (/^3[47]/.test(cleanNumber)) return 'American Express'
  if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover'
  if (/^62/.test(cleanNumber)) return 'UnionPay'
  if (/^35(?:2[89]|[3-8])/.test(cleanNumber)) return 'JCB'
  return ''
}

// Map card brand to image
const cardBrandImages: Record<string, string> = {
  Visa: visaCardImg,
  Mastercard: mastercardCardImg,
  'American Express': amexCardImg,
  Discover: discoverCardImg,
  UnionPay: unionpayCardImg,
  JCB: jcbCardImg,
}

// Format card number with spaces (every 4 digits, AMEX: 4-6-5)
const formatCardNumber = (value: string): string => {
  const clean = value.replace(/\D/g, '')
  // American Express: 4-6-5
  if (/^3[47]/.test(clean)) {
    return clean
      .slice(0, 15)
      .replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(' '),
      )
  }
  // All others: groups of 4
  return clean.slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}

// Format expiry with auto-slash
const formatExpiry = (value: string): string => {
  const clean = value.replace(/\D/g, '')
  if (clean.length === 0) return ''
  if (clean.length <= 2) return clean
  return `${clean.slice(0, 2)}/${clean.slice(2, 4)}`
}

const CheckoutPage = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const cartItems = useCartStore((state) => state.items)
  const clearCart = useCartStore((state) => state.clearCart)

  // Payment dialog state
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null)

  // Fetch addresses and payment methods
  const addressQuery = useSuspenseQuery(fetchAddressQueryOptions())
  const paymentMethodsQuery = useSuspenseQuery(
    fetchPaymentMethodsQueryOptions(),
  )

  const addresses = addressQuery.data
  const paymentMethods = paymentMethodsQuery.data

  // Dialog states
  const [addressDialogOpen, setAddressDialogOpen] = useState(false)
  const [cardDialogOpen, setCardDialogOpen] = useState(false)

  // Find defaults
  const defaultAddress = addresses.find((addr) => addr.isDefault)
  const defaultPaymentMethod = paymentMethods.find((pm) => pm.isDefault)

  // Shipping method state
  const [shippingMethod, setShippingMethod] = useState<
    'standard' | 'express' | 'overnight'
  >('standard')

  // Main checkout form
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema),
    mode: 'onChange',
    defaultValues: {
      billingAddressId: defaultAddress?.id ?? 0,
      paymentMethodId: defaultPaymentMethod?.id ?? 0,
      shippingMethod: 'standard',
      orderNotes: '',
    },
  })

  // Update form when defaults change
  useEffect(() => {
    if (defaultAddress && !form.getValues('billingAddressId')) {
      form.setValue('billingAddressId', defaultAddress.id)
    }
  }, [defaultAddress, form])

  useEffect(() => {
    if (defaultPaymentMethod && !form.getValues('paymentMethodId')) {
      form.setValue('paymentMethodId', defaultPaymentMethod.id)
    }
  }, [defaultPaymentMethod, form])

  // Address form
  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: { ...emptyAddressForm },
    mode: 'onChange',
  })

  // Card form
  const cardForm = useForm<CardFormValues>({
    resolver: zodResolver(CardFormSchema),
    defaultValues: {
      cardNumber: '',
      expiry: '',
      cvc: '',
      holderName: '',
      isDefault: false,
    },
    mode: 'onChange',
  })

  // Server functions
  const createAddressFn = useServerFn(createAddress)
  const updateAddressFn = useServerFn(updateAddress)
  const deleteAddressFn = useServerFn(deleteAddress)
  const createPaymentMethodFn = useServerFn(createPaymentMethod)
  const setDefaultPaymentMethodFn = useServerFn(setDefaultPaymentMethod)
  const deletePaymentMethodFn = useServerFn(deletePaymentMethod)
  const processOrderFn = useServerFn(processOrder)
  const processPaymentFn = useServerFn(processPayment)

  // Mutations
  const createAddressMutation = useMutation({
    mutationFn: (data: AddressFormValues) => createAddressFn({ data }),
    onSuccess: (newAddress) => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setAddressDialogOpen(false)
      addressForm.reset({ ...emptyAddressForm })
      form.setValue('billingAddressId', newAddress.id, { shouldValidate: true })
      toast.success('Address added successfully')
    },
    onError: (error) => {
      toast.error('Failed to add address', { description: error.message })
    },
  })

  const updateAddressMutation = useMutation({
    mutationFn: (data: { id: number }) => updateAddressFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })

  const deleteAddressMutation = useMutation({
    mutationFn: (data: { id: number }) => deleteAddressFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
    },
  })

  const createPaymentMethodMutation = useMutation({
    mutationFn: (data: CardFormValues) => {
      const [month, year] = data.expiry.split('/')
      return createPaymentMethodFn({
        data: {
          cardNumber: data.cardNumber,
          cardBrand: detectCardBrand(data.cardNumber),
          holderName: data.holderName,
          expiryMonth: month,
          expiryYear: year,
          cvc: data.cvc,
          isDefault: data.isDefault,
        },
      })
    },
    onSuccess: (newMethod) => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] })
      setCardDialogOpen(false)
      cardForm.reset({
        cardNumber: '',
        expiry: '',
        cvc: '',
        holderName: '',
        isDefault: false,
      })
      form.setValue('paymentMethodId', newMethod.id, { shouldValidate: true })
      toast.success('Payment method added successfully')
    },
    onError: (error) => {
      toast.error('Failed to add payment method', {
        description: error.message,
      })
    },
  })

  const setDefaultPaymentMutation = useMutation({
    mutationFn: (data: { id: number }) => setDefaultPaymentMethodFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] })
    },
  })

  const deletePaymentMethodMutation = useMutation({
    mutationFn: (data: { id: number }) => deletePaymentMethodFn({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentMethods'] })
    },
  })

  const processOrderMutation = useMutation({
    mutationFn: (data: CheckoutFormValues) => {
      return processOrderFn({
        data: {
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            extractedPrice: item.extractedPrice ?? 0,
          })),
          billingAddressId: data.billingAddressId,
          paymentMethodId: data.paymentMethodId,
          shippingMethod: data.shippingMethod,
          orderNotes: data.orderNotes,
        },
      })
    },
    onSuccess: (result) => {
      clearCart()
      // Open payment processing dialog
      setPendingOrderId(result.orderId)
      setPaymentDialogOpen(true)
    },
    onError: (error) => {
      toast.error('Failed to place order', { description: error.message })
    },
  })

  const handleAddressSelect = (id: string) => {
    const numId = Number(id)
    form.setValue('billingAddressId', numId, { shouldValidate: true })
    // Also set as default
    const currentDefault = addresses.find((a) => a.isDefault)
    if (currentDefault?.id !== numId) {
      updateAddressMutation.mutate({ id: numId })
    }
  }

  const handlePaymentMethodSelect = (id: string) => {
    const numId = Number(id)
    form.setValue('paymentMethodId', numId, { shouldValidate: true })
    // Also set as default
    const currentDefault = paymentMethods.find((pm) => pm.isDefault)
    if (currentDefault?.id !== numId) {
      setDefaultPaymentMutation.mutate({ id: numId })
    }
  }

  const handleDeleteAddress = (id: number) => {
    deleteAddressMutation.mutate({ id })
    if (form.getValues('billingAddressId') === id) {
      const remaining = addresses.filter((a) => a.id !== id)
      if (remaining.length > 0) {
        form.setValue('billingAddressId', remaining[0].id, {
          shouldValidate: true,
        })
      } else {
        form.setValue('billingAddressId', 0, { shouldValidate: true })
      }
    }
  }

  const handleDeletePaymentMethod = (id: number) => {
    deletePaymentMethodMutation.mutate({ id })
    if (form.getValues('paymentMethodId') === id) {
      const remaining = paymentMethods.filter((pm) => pm.id !== id)
      if (remaining.length > 0) {
        form.setValue('paymentMethodId', remaining[0].id, {
          shouldValidate: true,
        })
      } else {
        form.setValue('paymentMethodId', 0, { shouldValidate: true })
      }
    }
  }

  const onSubmit = (data: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    processOrderMutation.mutate(data)
  }

  // Calculate totals from cart (matching cart page logic)
  const subtotal = cartItems.reduce((sum, item) => {
    const price = Number(item.extractedPrice ?? 0)
    return sum + price * item.quantity
  }, 0)

  const hasItems = cartItems.length > 0 && subtotal > 0

  // Shipping: FREE if subtotal > $1000, otherwise based on method
  const shipping = !hasItems
    ? 0
    : subtotal > 1000
      ? 0
      : shippingMethod === 'express'
        ? 29.0
        : shippingMethod === 'overnight'
          ? 49.0
          : 19.0

  const discount = hasItems ? 43.0 : 0
  const tax = hasItems ? (subtotal + shipping - discount) * 0.08 : 0
  const total = hasItems ? subtotal + shipping - discount + tax : 0

  const selectedBillingId = form.watch('billingAddressId')
  const selectedPaymentId = form.watch('paymentMethodId')

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10"
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-8">
          {/* Billing Address Section */}
          <BillingAddressSection
            addresses={addresses}
            selectedId={selectedBillingId}
            onSelect={handleAddressSelect}
            onDelete={handleDeleteAddress}
            dialogOpen={addressDialogOpen}
            setDialogOpen={setAddressDialogOpen}
            form={addressForm}
            onSubmit={(data) => createAddressMutation.mutate(data)}
            isPending={createAddressMutation.isPending}
            error={form.formState.errors.billingAddressId?.message}
          />

          {/* Payment Method Section */}
          <PaymentMethodSection
            paymentMethods={paymentMethods}
            selectedId={selectedPaymentId}
            onSelect={handlePaymentMethodSelect}
            onDelete={handleDeletePaymentMethod}
            dialogOpen={cardDialogOpen}
            setDialogOpen={setCardDialogOpen}
            form={cardForm}
            onSubmit={(data) => createPaymentMethodMutation.mutate(data)}
            isPending={createPaymentMethodMutation.isPending}
            error={form.formState.errors.paymentMethodId?.message}
          />

          {/* Additional Info Section */}
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

        {/* Order Summary */}
        <OrderSummary
          items={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          discount={discount}
          shippingMethod={shippingMethod}
          onShippingMethodChange={(method) => {
            setShippingMethod(method)
            form.setValue('shippingMethod', method, { shouldValidate: true })
          }}
          tax={tax}
          total={total}
          isSubmitting={processOrderMutation.isPending}
          isValid={form.formState.isValid && cartItems.length > 0}
        />
      </div>

      {/* Payment Processing Dialog */}
      <PaymentProcessingDialog
        open={paymentDialogOpen}
        orderId={pendingOrderId}
        processPaymentFn={processPaymentFn}
        onComplete={(status) => {
          if (status === 'paid') {
            router.navigate({ to: '/profile/order-history' })
          }
          setPaymentDialogOpen(false)
          setPendingOrderId(null)
        }}
      />
    </form>
  )
}

// Payment Processing Dialog Component
const PROCESSING_DURATION = 30_000 // 30 seconds

type PaymentProcessingDialogProps = {
  open: boolean
  orderId: string | null
  processPaymentFn: ReturnType<typeof useServerFn<typeof processPayment>>
  onComplete: (status: 'paid' | 'declined') => void
}

const PaymentProcessingDialog = ({
  open,
  orderId,
  processPaymentFn,
  onComplete,
}: PaymentProcessingDialogProps) => {
  const [status, setStatus] = useState<'processing' | 'paid' | 'declined'>(
    'processing',
  )
  const [progress, setProgress] = useState(0)
  const [resultMessage, setResultMessage] = useState('')
  const [resultOrderId, setResultOrderId] = useState<string | null>(null)
  const hasStarted = useRef(false)
  const navigate = useRouter().navigate

  const paymentMutation = useMutation({
    mutationFn: (data: { orderId: string }) => processPaymentFn({ data }),
    onSuccess: (result) => {
      setResultOrderId(result.orderId)
      setResultMessage(result.message)
      setStatus(result.status)
    },
    onError: (error) => {
      setResultMessage(error.message || 'Payment processing failed.')
      setStatus('declined')
    },
  })

  // Reset state when dialog opens with a new order
  useEffect(() => {
    if (open && orderId) {
      setStatus('processing')
      setProgress(0)
      setResultMessage('')
      setResultOrderId(null)
      hasStarted.current = false
    }
  }, [open, orderId])

  useEffect(() => {
    if (!open || !orderId || hasStarted.current) return
    hasStarted.current = true

    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / PROCESSING_DURATION) * 100, 100)
      setProgress(pct)

      if (elapsed >= PROCESSING_DURATION) {
        clearInterval(interval)
        paymentMutation.mutate({ orderId })
      }
    }, 100)

    return () => clearInterval(interval)
  }, [open, orderId])

  const handleClose = useCallback(() => {
    if (status === 'processing') return // Prevent closing during processing
    onComplete(status)
  }, [status, onComplete])

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && status !== 'processing') {
          handleClose()
        }
      }}
    >
      <DialogContent
        className="sm:max-w-lg [&>button]:hidden"
        onInteractOutside={(e) => {
          if (status === 'processing') e.preventDefault()
        }}
        onEscapeKeyDown={(e) => {
          if (status === 'processing') e.preventDefault()
        }}
      >
        <div className="flex flex-col items-center gap-6 py-6">
          {status === 'processing' && (
            <>
              {/* Animated loader */}
              <div className="relative flex items-center justify-center">
                <div className="absolute size-20 animate-ping rounded-full bg-[#3858d6]/20" />
                <div className="absolute size-16 animate-pulse rounded-full bg-[#3858d6]/30" />
                <Loader2 className="size-12 animate-spin text-[#3858d6]" />
              </div>

              <h2 className="text-xl font-semibold text-foreground">
                Processing Payment
              </h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                Please wait while we securely process your payment. Do not close
                this window.
              </p>

              {/* Progress bar */}
              <div className="w-full max-w-xs">
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[#3858d6] transition-all duration-200 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                  <span>Verifying card</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </div>

              {/* Processing steps */}
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <ProcessingStep
                  label="Connecting to payment gateway"
                  active={progress < 30}
                  done={progress >= 30}
                />
                <ProcessingStep
                  label="Verifying card details"
                  active={progress >= 30 && progress < 60}
                  done={progress >= 60}
                />
                <ProcessingStep
                  label="Authorizing transaction"
                  active={progress >= 60 && progress < 85}
                  done={progress >= 85}
                />
                <ProcessingStep
                  label="Finalizing payment"
                  active={progress >= 85 && progress < 100}
                  done={progress >= 100}
                />
              </div>
            </>
          )}

          {status === 'paid' && (
            <>
              <div className="relative flex items-center justify-center">
                <div className="absolute size-20 rounded-full bg-green-100" />
                <CheckCircle2 className="relative size-14 text-green-500" />
              </div>

              <h2 className="text-2xl font-bold text-green-600">
                Payment Successful!
              </h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {resultMessage}
              </p>

              {resultOrderId && (
                <div className="rounded-lg border border-green-200 bg-green-50 px-6 py-3 text-center">
                  <p className="text-xs text-muted-foreground">Order Number</p>
                  <p className="text-lg font-bold text-green-700">
                    #{resultOrderId}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    onComplete('paid')
                    navigate({ to: '/profile/order-history' })
                  }}
                >
                  View Orders
                </Button>
                <Button
                  onClick={() => {
                    onComplete('paid')
                    navigate({ to: '/products' })
                  }}
                  className="bg-[#3858d6]"
                >
                  Continue Shopping
                </Button>
              </div>
            </>
          )}

          {status === 'declined' && (
            <>
              <div className="relative flex items-center justify-center">
                <div className="absolute size-20 rounded-full bg-red-100" />
                <XCircle className="relative size-14 text-red-500" />
              </div>

              <h2 className="text-2xl font-bold text-red-600">
                Payment Declined
              </h2>
              <p className="text-sm text-muted-foreground text-center max-w-sm">
                {resultMessage}
              </p>

              {resultOrderId && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-3 text-center">
                  <p className="text-xs text-muted-foreground">Order Number</p>
                  <p className="text-lg font-bold text-red-700">
                    #{resultOrderId}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    onComplete('declined')
                    navigate({ to: '/profile/order-history' })
                  }}
                >
                  View Orders
                </Button>
                <Button
                  onClick={() => onComplete('declined')}
                  className="bg-[#3858d6]"
                >
                  Back to Checkout
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Processing step sub-component
const ProcessingStep = ({
  label,
  active,
  done,
}: {
  label: string
  active: boolean
  done: boolean
}) => (
  <div className="flex items-center gap-2">
    {done ? (
      <CheckCircle2 className="size-4 text-green-500" />
    ) : active ? (
      <Loader2 className="size-4 animate-spin text-[#3858d6]" />
    ) : (
      <div className="size-4 rounded-full border border-gray-300" />
    )}
    <span
      className={
        done
          ? 'text-green-600'
          : active
            ? 'font-medium text-[#3858d6]'
            : 'text-muted-foreground'
      }
    >
      {label}
    </span>
  </div>
)

// Billing Address Section Component
type BillingAddressSectionProps = {
  addresses: Array<Address>
  selectedId: number
  onSelect: (id: string) => void
  onDelete: (id: number) => void
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  form: ReturnType<typeof useForm<AddressFormValues>>
  onSubmit: (data: AddressFormValues) => void
  isPending: boolean
  error?: string
}

const BillingAddressSection = ({
  addresses,
  selectedId,
  onSelect,
  onDelete,
  dialogOpen,
  setDialogOpen,
  form,
  onSubmit,
  isPending,
  error,
}: BillingAddressSectionProps) => {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Billing Address</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {addresses.length > 0 ? (
          <RadioGroup
            value={selectedId.toString()}
            onValueChange={onSelect}
            className="gap-4"
          >
            {addresses.map((address) => (
              <label
                key={address.id}
                className={`flex items-start justify-between rounded-lg border p-4 transition cursor-pointer ${
                  selectedId === address.id
                    ? 'border-[#3858d6] bg-[#f1f4ff]'
                    : 'border-gray-200 hover:border-[#3858d6]'
                }`}
              >
                <div className="flex gap-3">
                  <RadioGroupItem value={address.id.toString()} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {address.address1}
                    </p>
                    {address.address2 && (
                      <p className="text-xs text-muted-foreground">
                        {address.address2}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {address.country}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedId === address.id && (
                    <Check className="size-4 text-[#3858d6]" />
                  )}
                  {addresses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault()
                        onDelete(address.id)
                      }}
                    >
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </label>
            ))}
          </RadioGroup>
        ) : (
          <p className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-muted-foreground text-center">
            No addresses found. Add your first billing address.
          </p>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" className="w-fit bg-[#3858d6]">
              <Plus className="mr-2 size-4" /> Add New Address
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Billing Address</DialogTitle>
              <DialogDescription>
                Save a new billing address to your account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <Controller
                control={form.control}
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
                          placeholder="123 Market St"
                          disabled={isPending}
                          {...field}
                        />
                      </InputGroup>
                      <FieldError>
                        {form.formState.errors.address1?.message}
                      </FieldError>
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="address2"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="billing-address2">
                      Address line 2 (Optional)
                    </FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupAddon>
                          <Building2 />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="billing-address2"
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
                      <FieldLabel htmlFor="billing-city">City</FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <MapPin />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="billing-city"
                            placeholder="San Francisco"
                            disabled={isPending}
                            {...field}
                          />
                        </InputGroup>
                        <FieldError>
                          {form.formState.errors.city?.message}
                        </FieldError>
                      </FieldContent>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor="billing-state">
                        State (Optional)
                      </FieldLabel>
                      <FieldContent>
                        <InputGroup>
                          <InputGroupAddon>
                            <MapPin />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="billing-state"
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
                    <FieldLabel htmlFor="billing-country">Country</FieldLabel>
                    <FieldContent>
                      <InputGroup>
                        <InputGroupAddon>
                          <Globe />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="billing-country"
                          placeholder="United States"
                          disabled={isPending}
                          {...field}
                        />
                      </InputGroup>
                      <FieldError>
                        {form.formState.errors.country?.message}
                      </FieldError>
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
                      id="billing-isDefault"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      disabled={isPending}
                    />
                    <label
                      htmlFor="billing-isDefault"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Set as default billing address
                    </label>
                  </div>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset({ ...emptyAddressForm })}
                  disabled={isPending}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  className="bg-[#3858d6]"
                  disabled={!form.formState.isValid || isPending}
                >
                  {isPending ? 'Saving...' : 'Save Address'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

// Payment Method Section Component
type PaymentMethodSectionProps = {
  paymentMethods: Array<PaymentMethod>
  selectedId: number
  onSelect: (id: string) => void
  onDelete: (id: number) => void
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  form: ReturnType<typeof useForm<CardFormValues>>
  onSubmit: (data: CardFormValues) => void
  isPending: boolean
  error?: string
}

const PaymentMethodSection = ({
  paymentMethods,
  selectedId,
  onSelect,
  onDelete,
  dialogOpen,
  setDialogOpen,
  form,
  onSubmit,
  isPending,
  error,
}: PaymentMethodSectionProps) => {
  return (
    <Card className="border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg">Payment Method</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {paymentMethods.length > 0 ? (
          <RadioGroup
            value={selectedId.toString()}
            onValueChange={onSelect}
            className="gap-4"
          >
            {paymentMethods.map((pm) => {
              const lastFour = pm.cardNumber.slice(-4)
              const brandImg = cardBrandImages[pm.cardBrand]
              return (
                <label
                  key={pm.id}
                  className={`flex items-center justify-between rounded-lg border p-4 transition cursor-pointer ${
                    selectedId === pm.id
                      ? 'border-[#3858d6] bg-[#f1f4ff]'
                      : 'border-gray-200 hover:border-[#3858d6]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value={pm.id.toString()} />
                    {brandImg ? (
                      <img
                        src={brandImg}
                        alt={pm.cardBrand}
                        className="h-8 w-auto object-contain"
                      />
                    ) : (
                      <CreditCard className="size-5 text-[#3858d6]" />
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        {pm.cardBrand} ending in {lastFour}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires {pm.expiryMonth}/{pm.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedId === pm.id && (
                      <Check className="size-4 text-[#3858d6]" />
                    )}
                    {paymentMethods.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.preventDefault()
                          onDelete(pm.id)
                        }}
                      >
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </label>
              )
            })}
          </RadioGroup>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-muted-foreground text-center">
            No payment methods found. Add a payment method.
          </div>
        )}

        {error && <p className="text-xs text-red-500">{error}</p>}

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="card-number">Card Number</Label>
                <Controller
                  control={form.control}
                  name="cardNumber"
                  render={({ field }) => {
                    const brand = detectCardBrand(field.value)
                    const brandImg = brand ? cardBrandImages[brand] : null
                    return (
                      <div className="relative">
                        <Input
                          id="card-number"
                          placeholder="4242 4242 4242 4242"
                          disabled={isPending}
                          value={field.value}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value)
                            field.onChange(formatted)
                          }}
                          className="pr-14 font-mono tracking-wider"
                          inputMode="numeric"
                          maxLength={19}
                        />
                        {brandImg && (
                          <img
                            src={brandImg}
                            alt={brand}
                            className="absolute right-3 top-1/2 h-6 w-auto -translate-y-1/2 object-contain"
                          />
                        )}
                      </div>
                    )
                  }}
                />
                {form.formState.errors.cardNumber?.message && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.cardNumber.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="grid gap-3">
                  <Label htmlFor="card-expiry">Expiry</Label>
                  <Controller
                    control={form.control}
                    name="expiry"
                    render={({ field }) => (
                      <Input
                        id="card-expiry"
                        placeholder="MM/YY"
                        disabled={isPending}
                        value={field.value}
                        onChange={(e) => {
                          const raw = e.target.value
                          // Allow backspace to remove slash
                          if (
                            raw.length < field.value.length &&
                            field.value.endsWith('/')
                          ) {
                            field.onChange(raw.slice(0, -1))
                            return
                          }
                          const formatted = formatExpiry(raw)
                          field.onChange(formatted)
                        }}
                        inputMode="numeric"
                        maxLength={5}
                        className="font-mono tracking-wider"
                      />
                    )}
                  />
                  {form.formState.errors.expiry?.message && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.expiry.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="card-cvc">CVC</Label>
                  <Controller
                    control={form.control}
                    name="cvc"
                    render={({ field }) => {
                      const cardNum = form.watch('cardNumber')
                      const brand = detectCardBrand(cardNum)
                      const maxLen = brand === 'American Express' ? 4 : 3
                      return (
                        <Input
                          id="card-cvc"
                          placeholder={
                            brand === 'American Express' ? '1234' : '123'
                          }
                          disabled={isPending}
                          value={field.value}
                          onChange={(e) => {
                            const clean = e.target.value
                              .replace(/\D/g, '')
                              .slice(0, maxLen)
                            field.onChange(clean)
                          }}
                          inputMode="numeric"
                          maxLength={maxLen}
                          className="font-mono tracking-wider"
                          type="password"
                        />
                      )
                    }}
                  />
                  {form.formState.errors.cvc?.message && (
                    <p className="text-xs text-red-500">
                      {form.formState.errors.cvc.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="card-holder">Cardholder Name</Label>
                <Input
                  id="card-holder"
                  placeholder="Alex Johnson"
                  disabled={isPending}
                  {...form.register('holderName')}
                />
                {form.formState.errors.holderName?.message && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.holderName.message}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Controller
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <>
                      <Checkbox
                        id="card-isDefault"
                        checked={field.value}
                        onCheckedChange={(checked) => field.onChange(checked)}
                        disabled={isPending}
                      />
                      <label
                        htmlFor="card-isDefault"
                        className="text-sm font-medium leading-none"
                      >
                        Set as default payment method
                      </label>
                    </>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-[#3858d6]"
                  disabled={!form.formState.isValid || isPending}
                >
                  {isPending ? 'Saving...' : 'Save Card'}
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
  )
}

// Order Summary Component
type OrderSummaryProps = {
  items: Array<CartItem>
  subtotal: number
  shipping: number
  discount: number
  shippingMethod: 'standard' | 'express' | 'overnight'
  onShippingMethodChange: (method: 'standard' | 'express' | 'overnight') => void
  tax: number
  total: number
  isSubmitting: boolean
  isValid: boolean
}

const OrderSummary = ({
  items,
  subtotal,
  shipping,
  discount,
  shippingMethod,
  onShippingMethodChange,
  tax,
  total,
  isSubmitting,
  isValid,
}: OrderSummaryProps) => {
  return (
    <Card className="border-gray-200 h-fit sticky top-4">
      <CardHeader>
        <CardTitle className="text-lg">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {items.length > 0 ? (
          <div className="flex flex-col gap-4 max-h-80 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <img
                  src={item.thumbnail ?? '/images/placeholder.png'}
                  alt={item.title}
                  className="size-14 rounded-lg border border-gray-200 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  $
                  {(Number(item.extractedPrice ?? 0) * item.quantity).toFixed(
                    2,
                  )}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            Your cart is empty
          </p>
        )}

        <div className="flex flex-col gap-3 border-t pt-4 text-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping Method */}
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="text-right">
              {shipping === 0 ? (
                <span className="text-green-600 font-semibold">FREE</span>
              ) : (
                `$${shipping.toFixed(2)}`
              )}
            </span>
          </div>
          {subtotal > 0 && (
            <div className="flex flex-col gap-2">
              <RadioGroup
                value={shippingMethod}
                onValueChange={(val) =>
                  onShippingMethodChange(
                    val as 'standard' | 'express' | 'overnight',
                  )
                }
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="standard"
                    id="checkout-standard"
                    disabled={subtotal > 1000}
                  />
                  <label htmlFor="checkout-standard" className="text-xs">
                    Standard ($19.00) - 5-7 days
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="express"
                    id="checkout-express"
                    disabled={subtotal > 1000}
                  />
                  <label htmlFor="checkout-express" className="text-xs">
                    Express ($29.00) - 2-3 days
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="overnight"
                    id="checkout-overnight"
                    disabled={subtotal > 1000}
                  />
                  <label htmlFor="checkout-overnight" className="text-xs">
                    Overnight ($49.00) - Next day
                  </label>
                </div>
              </RadioGroup>
              {subtotal > 1000 && (
                <p className="text-xs text-green-600 italic">
                  Free shipping applied on orders over $1,000!
                </p>
              )}
            </div>
          )}

          {/* Discount */}
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Discount</span>
            <span className="text-green-600">-${discount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold text-foreground border-t pt-3">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 w-full bg-[#3858d6] text-base"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Place Order'}
        </Button>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="size-4" /> Free shipping over $1,000
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4" />{' '}
            {shippingMethod === 'overnight'
              ? 'Next day'
              : shippingMethod === 'express'
                ? '2-3 days'
                : '5-7 days'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CheckoutPage
