import { Link } from '@tanstack/react-router'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const AccountInfoCard = ({
  children,
  title,
  link,
  linkLabel,
}: {
  title: string
  link: string
  linkLabel: string
  children: React.ReactNode
}) => {
  return (
    <Card className="col-span-1 border-gray-300 bg-white">
      <CardHeader className="border-b [.border-b]:pb-3">
        <CardTitle className="text-base font-normal uppercase text-foreground ">
          {title}
        </CardTitle>
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
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-base font-semibold text-foreground capitalize">
            John Doe
          </span>
          <span className="text-sm text-heading">Calicut, Kerala</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="text-sm text-foreground">Phone: </span>
          <span className="text-sm text-heading">+1 234 567 890</span>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-foreground">Email:</span>
          <span className="text-sm text-heading">john_doe@example.com</span>
        </div>
      </div>
    </div>
  )
}
export const AddressInfoContent = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <span className="text-sm text-foreground capitalize">John Doe</span>
        <span className="text-sm text-heading">
          123 Main Street, Apt 4B, Springfield, IL 62704
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <span className="text-sm text-foreground">Phone Number: </span>
          <span className="text-sm text-heading">+1 234 567 890</span>
        </div>
        <div className="flex gap-2">
          <span className="text-sm text-foreground">Email:</span>
          <span className="text-sm text-heading">john_doe@example.com</span>
        </div>
      </div>
    </div>
  )
}
export default AccountInfoCard
