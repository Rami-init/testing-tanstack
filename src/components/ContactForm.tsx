import { MailIcon, UserIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export function ContactForm() {
  return (
    <Card className="w-full max-w-sm bg-[#17181C] border-0 px-6 py-8">
      <CardHeader className="gap-5">
        <CardTitle className="text-primary font-bold text-[10px] uppercase">
          Feedback
        </CardTitle>
        <CardDescription className="font-bold text-2xl">
          <span>Seeking personalized support? </span>
          <span className="text-white">Request a call from our team</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-heading">
                Email
              </Label>
              <InputGroup>
                <InputGroupInput type="email" placeholder="ex@example.com" />
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username" className="text-heading">
                Username
              </Label>
              <InputGroup>
                <InputGroupInput type="username" placeholder="your_username" />
                <InputGroupAddon>
                  <UserIcon />
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2 items-start">
        <Button type="submit">Send Request</Button>
        <CardTitle className="text-heading font-bold text-[10px] uppercase mt-8">
          Privacy
        </CardTitle>
      </CardFooter>
    </Card>
  )
}
