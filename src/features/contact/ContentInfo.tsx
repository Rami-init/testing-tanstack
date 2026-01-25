import { MailIcon, MapPinIcon, PhoneIcon } from 'lucide-react'
import FaceBookIcon from '@/assets/icons/FacebookIcon'
import InstagramIcon from '@/assets/icons/InstagramIcon'
import XIcon from '@/assets/icons/XIcon'
import { IconLink } from '@/components/Footer'

export const ContactInfo = () => {
  return (
    <div className="col-span-1 p-10 text-white bg-linear-to-b from-[#0B0B0B] to-[#383638] rounded-lg flex flex-col gap-6 justify-between overflow-hidden relative">
      <div>
        <h2 className="text-2xl font-semibold">Contact Information</h2>
        <p className="text-[#C9C9C9]">Say something to start a live chat!</p>
      </div>
      <div className="flex flex-col gap-4">
        <ContactDetails content=" +30-698-545-2831">
          <PhoneIcon size={20} className="shrink-0" />
        </ContactDetails>
        <ContactDetails content="chat@ex-iphones.com">
          <MailIcon size={20} className="shrink-0" />
        </ContactDetails>
        <ContactDetails content="23, Καλλιστράτους St., Regional Unit of Central Athens, Athens, Greece">
          <MapPinIcon size={20} className="shrink-0" />
        </ContactDetails>
      </div>
      <div className="flex gap-4 items-center">
        <IconLink icon={FaceBookIcon} href="https://www.facebook.com" />
        <IconLink icon={InstagramIcon} href="https://www.instagram.com" />
        <IconLink icon={XIcon} href="https://www.twitter.com" />
      </div>
      <div className="size-66 bg-muted-foreground/40 rounded-full absolute bottom-0 right-0 translate-2/5"></div>
      <div className="size-36 bg-border/40 rounded-full absolute bottom-0 right-0 -translate-1/5"></div>
    </div>
  )
}
const ContactDetails = ({
  children,
  content,
}: {
  children: React.ReactNode
  content: string
}) => {
  return (
    <div className="flex items-center gap-4">
      {children}
      <span className="text-base text-heading">{content}</span>
    </div>
  )
}
