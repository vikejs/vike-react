export { Wrapper }

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode, useState } from 'react'
import { StreamedHydration } from './StreamedHydration.js'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { queryClientConfig, FallbackErrorBoundary = PassThrough } = pageContext.config
  const [queryClient] = useState(() => {
    const config = typeof queryClientConfig === 'function' ? queryClientConfig(pageContext) : queryClientConfig
    return new QueryClient(config)
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
