import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_rootLayout/payment')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_rootLayout/payment"!</div>
}
