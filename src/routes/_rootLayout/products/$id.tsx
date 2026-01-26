import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_rootLayout/products/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_rootLayout/products/$id"!</div>
}
