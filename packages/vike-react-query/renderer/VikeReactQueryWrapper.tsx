import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode, useMemo } from 'react'
import 'vike-react'
import type { PageContext } from 'vike/types'
import { StreamedHydration } from './StreamedHydration'

type VikeReactQueryWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactQueryWrapper({ pageContext, children }: VikeReactQueryWrapperProps) {
  const { queryClientConfig, FallbackErrorBoundary = PassThrough } = pageContext.config
  const queryClient = useMemo(() => new QueryClient(queryClientConfig), [])

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
