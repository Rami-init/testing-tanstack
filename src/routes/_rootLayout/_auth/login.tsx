import { createFileRoute } from '@tanstack/react-router'
import AuthContainer from '@/features/auth/AuthContainer'
import { LoginForm } from '@/features/auth/LoginForm'

export const Route = createFileRoute('/_rootLayout/_auth/login')({
  component: () => (
    <div className="flex items-center justify-center">
      <AuthContainer className="w-120 max-h-154 bg-background border border-border">
        <LoginForm />
      </AuthContainer>
    </div>
  ),
})
