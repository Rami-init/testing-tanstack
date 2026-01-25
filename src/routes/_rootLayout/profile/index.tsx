import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_rootLayout/profile/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_rootLayout/profile/"!</div>
}
