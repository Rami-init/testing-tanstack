import ContentForm from './ContentForm'
import { ContactInfo } from './ContentInfo'

const ContactPage = () => {
  return (
    <div className="flex flex-col py-10 container mx-auto mt-16 flex-1">
      <div className="grid grid-cols-3 bg-white rounded-lg p-2 shadow-md">
        <ContactInfo />
        <div className="col-span-2 px-8 py-12">
          <ContentForm />
        </div>
      </div>
    </div>
  )
}

export default ContactPage
