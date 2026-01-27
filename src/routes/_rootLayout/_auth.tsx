import { Outlet, createFileRoute } from '@tanstack/react-router'
import LoginThumb from '@/assets/login-thumb.png'

export const Route = createFileRoute('/_rootLayout/_auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex-1 gap-8 flex justify-between items-center container mx-auto min-h-svh">
      <img src={LoginThumb} width={500} height={500} alt="Login Thumbnail" />
      <Outlet />
    </div>
  )
}
