import { createFileRoute } from '@tanstack/react-router'
import About from '@/features/about/About'

export const Route = createFileRoute('/_rootLayout/about')({
  head: () => ({
    meta: [
      { title: 'About Us | ex-phonex' },
      {
        name: 'description',
        content:
          'Learn about ex-phonex — our mission, values, and commitment to providing premium refurbished smartphones at unbeatable prices.',
      },
      { property: 'og:title', content: 'About Us | ex-phonex' },
      { property: 'og:url', content: 'https://www.ex-phonex.com/about' },
    ],
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return <About />
}
