export { Wrapper }

import { QueryClient, QueryClientProvider, type QueryClientConfig } from '@tanstack/react-query'
import React, { ReactNode, useState } from 'react'
import { StreamedHydration } from './StreamedHydration.js'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { queryClientConfig, FallbackErrorBoundary = PassThrough } = pageContext.config
  const [queryClient] = useState(() => {
    const config = typeof queryClientConfig === 'function' ? queryClientConfig(pageContext) : queryClientConfig
    return getQueryClient(config)
  })

  return (
    <QueryClientProvider client={queryClient}>
      <FallbackErrorBoundary>
        <StreamedHydration client={queryClient}>{children}</StreamedHydration>
      </FallbackErrorBoundary>
    </QueryClientProvider>
  )
}

function PassThrough({ children }: any) {
  return <>{children}</>
}

let clientQueryClient: QueryClient | undefined
function getQueryClient(config: QueryClientConfig | undefined) {
  if (!isBrowser()) return new QueryClient(config)
  // React may throw away a partially rendered tree if it suspends, and then start again from scratch.
  // If it's no suspense boundary between the creation of queryClient and useSuspenseQuery,
  // then the entire tree is thrown away, including the creation of queryClient, which may produce infinity refetchs
  // https://github.com/TanStack/query/issues/6116#issuecomment-1904051005
  // https://github.com/vikejs/vike-react/pull/157
  if (!clientQueryClient) clientQueryClient = new QueryClient(config)
  return clientQueryClient
}

function isBrowser() {
  // Using `typeof window !== 'undefined'` alone is not enough because some users use https://www.npmjs.com/package/ssr-window
  return typeof window !== 'undefined' && typeof window.scrollY === 'number'
  // Alternatively, test whether environment is a *real* browser: https://github.com/brillout/picocolors/blob/d59a33a0fd52a8a33e4158884069192a89ce0113/picocolors.js#L87-L89
}
