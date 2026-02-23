import { createFileRoute } from '@tanstack/react-router'
import Page from '@/features/home/Page'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'ex-phonex | Premium Refurbished Phones' },
      {
        name: 'description',
        content:
          'Shop premium quality refurbished smartphones at ex-phonex. Best prices, warranty included, and fast shipping on every order.',
      },
      {
        property: 'og:title',
        content: 'ex-phonex | Premium Refurbished Phones',
      },
      { property: 'og:url', content: 'https://www.ex-phonex.com' },
    ],
  }),
  component: Page,
})
