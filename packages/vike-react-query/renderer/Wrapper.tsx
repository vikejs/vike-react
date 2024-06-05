import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode, useState } from 'react'
import type { PageContext } from 'vike/types'
import { StreamedHydration } from './StreamedHydration.js'

type WrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function Wrapper({ pageContext, children }: WrapperProps) {
  const { queryClientConfig, FallbackErrorBoundary = PassThrough } = pageContext.config
  const [queryClient] = useState(() => new QueryClient(queryClientConfig))

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
