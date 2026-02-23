import { useMutation } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { processPayment } from '@/data/checkout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type PaymentStatus = 'processing' | 'paid' | 'declined'

const PROCESSING_DURATION = 30_000 // 30 seconds

const PaymentPage = () => {
  const { orderId } = useSearch({ strict: false })
  const navigate = useNavigate()
  const processPaymentFn = useServerFn(processPayment)

  const [status, setStatus] = useState<PaymentStatus>('processing')
  const [progress, setProgress] = useState(0)
  const [resultMessage, setResultMessage] = useState('')
  const [resultOrderId, setResultOrderId] = useState<number | null>(null)
  const hasStarted = useRef(false)

  const paymentMutation = useMutation({
    mutationFn: (data: { orderId: number }) => processPaymentFn({ data }),
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

  useEffect(() => {
    if (!orderId || hasStarted.current) return
    hasStarted.current = true

    // Simulate processing with progress bar
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const pct = Math.min((elapsed / PROCESSING_DURATION) * 100, 100)
      setProgress(pct)

      if (elapsed >= PROCESSING_DURATION) {
        clearInterval(interval)
        // Now actually process the payment
        paymentMutation.mutate({ orderId })
      }
    }, 100)

    return () => clearInterval(interval)
  }, [orderId])

  if (!orderId) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <Card className="w-full max-w-lg border-gray-200">
          <CardContent className="flex flex-col items-center gap-6 py-12">
            <XCircle className="size-16 text-red-500" />
            <h2 className="text-xl font-semibold text-foreground">
              No Order Found
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              No order ID was provided. Please go back to checkout.
            </p>
            <Button
              onClick={() => navigate({ to: '/checkout' })}
              className="bg-[#3858d6]"
            >
              Back to Checkout
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="w-full max-w-lg border-gray-200">
        <CardContent className="flex flex-col items-center gap-6 py-12">
          {status === 'processing' && (
            <>
              {/* Animated Stripe-like loader */}
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
                or refresh this page.
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

              {/* Processing steps animation */}
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
                  onClick={() => navigate({ to: '/profile/order-history' })}
                >
                  View Orders
                </Button>
                <Button
                  onClick={() => navigate({ to: '/products' })}
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
                  onClick={() => navigate({ to: '/profile/order-history' })}
                >
                  View Orders
                </Button>
                <Button
                  onClick={() => navigate({ to: '/checkout' })}
                  className="bg-[#3858d6]"
                >
                  Try Again
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
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
            ? 'text-[#3858d6] font-medium'
            : 'text-muted-foreground'
      }
    >
      {label}
    </span>
  </div>
)

export default PaymentPage
