import { zodResolver } from '@hookform/resolvers/zod'
import { Loader, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { ContactFormType } from '@/schema/contact'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { ContactFormSchema } from '@/schema/contact'

const ContentForm = () => {
  const form = useForm<ContactFormType>({
    resolver: zodResolver(ContactFormSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      subject: 'General Inquiry',
    },
  })

  const onSubmit = async (data: ContactFormType) => {
    await new Promise((res) => setTimeout(res, 1000))
    toast.success('Message sent successfully!')
    return data
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-6 my-5">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your first name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    className="resize-none"
                    placeholder="Enter your last name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="eg: user@example.com"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="eg: +1234567890" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem className="mb-6 gap-4">
              <FormLabel>Select Subject?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex gap-5"
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="General Inquiry" id="r1" />
                    <Label htmlFor="r1">General Inquiry</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="Support" id="r2" />
                    <Label htmlFor="r2">Support</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="Feedback" id="r3" />
                    <Label htmlFor="r3">Feedback</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="Other" id="r4" />
                    <Label htmlFor="r4">Other</Label>
                  </div>
                </RadioGroup>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className="mb-6">
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  className="resize-none"
                  rows={3}
                  placeholder="Your message... "
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader className="animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send />
              <span>Send Message</span>
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

export default ContentForm
