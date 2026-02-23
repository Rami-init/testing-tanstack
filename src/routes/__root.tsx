import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'ex-phonex | Premium Refurbished Phones' },
      {
        name: 'description',
        content:
          'Shop premium quality refurbished smartphones at ex-phonex. Best prices, warranty included, and fast shipping on every order.',
      },
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#3858d6' },
      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'ex-phonex' },
      {
        property: 'og:title',
        content: 'ex-phonex | Premium Refurbished Phones',
      },
      {
        property: 'og:description',
        content:
          'Shop premium quality refurbished smartphones at ex-phonex. Best prices, warranty included, and fast shipping on every order.',
      },
      { property: 'og:image', content: 'https://www.ex-phonex.com/logo.svg' },
      { property: 'og:url', content: 'https://www.ex-phonex.com' },
      // Twitter / X
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content: 'ex-phonex | Premium Refurbished Phones',
      },
      {
        name: 'twitter:description',
        content:
          'Shop premium quality refurbished smartphones at ex-phonex. Best prices, warranty included.',
      },
      { name: 'twitter:image', content: 'https://www.ex-phonex.com/logo.svg' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),

  notFoundComponent: () => <div>Page Not Found (404)</div>,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
