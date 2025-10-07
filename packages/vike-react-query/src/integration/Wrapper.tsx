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
  if (!globalThis.__VIKE__IS_CLIENT) {
    return new QueryClient(config)
  } else {
    // React may throw away a partially rendered tree if it suspends, and then start again from scratch.
    // If it's no suspense boundary between the creation of queryClient and useSuspenseQuery,
    // then the entire tree is thrown away, including the creation of queryClient, which may produce infinity refetchs
    // https://github.com/TanStack/query/issues/6116#issuecomment-1904051005
    // https://github.com/vikejs/vike-react/pull/157
    if (!clientQueryClient) clientQueryClient = new QueryClient(config)
    return clientQueryClient
  }
}
