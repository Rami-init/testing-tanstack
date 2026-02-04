import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { ComponentType } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchDefaultAddressQueryOptions } from '@/data/address'
import { authClient } from '@/lib/auth-client'
import { getInitials } from '@/lib/utils'

const AccountInfoCard = ({
  children,
  title,
  link,
  linkLabel,
  icon: Icon,
}: {
  title: string
  link: string
  linkLabel: string
  icon?: ComponentType<React.SVGProps<SVGSVGElement>>
  children: React.ReactNode
}) => {
  return (
    <Card className="col-span-1 border-gray-300 bg-white transition-shadow hover:shadow-md">
      <CardHeader className="border-b [.border-b]:pb-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
          )}
          <CardTitle className="text-base font-normal uppercase text-foreground">
            {title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          {children}
          <Button
            variant="outline"
            className="h-10 px-4 max-w-32 bg-white border-primary text-primary hover:bg-primary/10 hover:text-primary mt-2"
            asChild
          >
            <Link to={link}>{linkLabel}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
export const AccountInfoContent = () => {
  const session = authClient.useSession()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarImage
            src={session.data?.user.image ?? ''}
            alt={session.data?.user.name ?? 'User Avatar'}
          />
          <AvatarFallback>
            {getInitials(session.data?.user.name || 'User')}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-foreground capitalize">
            {session.data?.user.name}
          </span>
          <span className="text-sm text-heading">
            {session.data?.user.email}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="text-sm text-foreground">Phone: </span>
          <span className="text-sm text-heading">
            {session.data?.user.mobile}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-foreground">Email:</span>
          <span className="text-sm text-heading">
            {session.data?.user.email}
          </span>
        </div>
      </div>
    </div>
  )
}
export const AddressInfoContent = () => {
  const session = authClient.useSession()
  const { data: defaultAddress, isLoading } = useQuery(
    fetchDefaultAddressQueryOptions(),
  )
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-foreground capitalize">
          {session.data?.user.name}
        </span>
        {isLoading ? (
          <Skeleton className="h-4 w-48" />
        ) : (
          <span className="text-sm text-heading">
            {defaultAddress?.address1 ?? 'No default address found.'}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="text-sm text-foreground">Phone Number: </span>
          <span className="text-sm text-heading">
            {session.data?.user.mobile}
          </span>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-foreground">Email:</span>
          <span className="text-sm text-heading">
            {session.data?.user.email}
          </span>
        </div>
      </div>
    </div>
  )
}
export default AccountInfoCard
