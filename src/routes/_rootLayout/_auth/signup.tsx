import { createFileRoute } from '@tanstack/react-router'
import AuthContainer from '@/features/auth/AuthContainer'
import { SignupForm } from '@/features/auth/SignupForm'

export const Route = createFileRoute('/_rootLayout/_auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex items-center justify-center py-10">
      <AuthContainer className="w-120 bg-background border border-border">
        <SignupForm />
      </AuthContainer>
    </div>
  )
}
