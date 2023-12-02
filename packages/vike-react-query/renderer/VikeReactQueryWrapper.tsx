import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode } from 'react'
import 'vike-react'
import type { PageContext } from 'vike/types'
import { StreamedHydration } from './StreamedHydration'

let __queryClientGlobal: QueryClient | undefined

type VikeReactQueryWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactQueryWrapper({ pageContext, children }: VikeReactQueryWrapperProps) {
  const { queryClientConfig, FallbackErrorBoundary = PassThrough } = pageContext.config

  if (!import.meta.env.SSR && !__queryClientGlobal) {
    __queryClientGlobal = new QueryClient(queryClientConfig)
  }
  const queryClient = __queryClientGlobal ?? new QueryClient(queryClientConfig)

  return (
    <>
      <StreamedHydration client={queryClient} />
      <QueryClientProvider client={queryClient}>
        <FallbackErrorBoundary>{children}</FallbackErrorBoundary>
      </QueryClientProvider>
    </>
  )
}

function PassThrough({ children }: any) {
  return <>{children}</>
}
