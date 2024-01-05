import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { ReactNode, useState } from 'react'
import type { PageContext } from 'vike/types'
import { StreamedHydration } from './StreamedHydration.js'

type VikeReactQueryWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactQueryWrapper({ pageContext, children }: VikeReactQueryWrapperProps) {
  const { queryClientConfig, FallbackErrorBoundary = PassThrough, stream } = pageContext.config
  const [queryClient] = useState(() => new QueryClient(queryClientConfig))

  const RQStreamedHydration = stream ? StreamedHydration : PassThrough

  return (
    <QueryClientProvider client={queryClient}>
      <FallbackErrorBoundary>
        <RQStreamedHydration>{children}</RQStreamedHydration>
      </FallbackErrorBoundary>
    </QueryClientProvider>
  )
}

function PassThrough({ children }: any) {
  return <>{children}</>
}
