import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import 'vike-react'
import type { PageContext } from 'vike/types'
import { StreamedHydration } from './StreamedHydration'

let __queryClientGlobal: QueryClient | undefined

export default function internalOnBeforeRenderAll(pageContext: PageContext) {
  const {
    Page,
    config: { queryClientConfig, FallbackErrorBoundary = PassThrough }
  } = pageContext

  if (!Page) {
    return
  }

  if (!import.meta.env.SSR && !__queryClientGlobal) {
    __queryClientGlobal = new QueryClient(queryClientConfig)
  }
  const queryClient = __queryClientGlobal ?? new QueryClient(queryClientConfig)

  if (Page) {
    // The page is re-rendered anyway, so a function is fine here
    pageContext.Page = (props) => (
      <>
        <StreamedHydration client={queryClient} />
        <QueryClientProvider client={queryClient}>
          <FallbackErrorBoundary>
            <Page {...props} />
          </FallbackErrorBoundary>
        </QueryClientProvider>
      </>
    )
  }
}

function PassThrough({ children }: any) {
  return <>{children}</>
}
