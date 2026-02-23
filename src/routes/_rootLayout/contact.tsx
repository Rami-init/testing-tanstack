import { createFileRoute } from '@tanstack/react-router'
import ContactPage from '@/features/contact/ContactPage'

export const Route = createFileRoute('/_rootLayout/contact')({
  head: () => ({
    meta: [
      { title: 'Contact Us | ex-phonex' },
      {
        name: 'description',
        content:
          'Get in touch with the ex-phonex team. We are here to help you with orders, returns, and any questions about our refurbished smartphones.',
      },
      { property: 'og:title', content: 'Contact Us | ex-phonex' },
      { property: 'og:url', content: 'https://www.ex-phonex.com/contact' },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <ContactPage />
}
