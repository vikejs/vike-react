import { ApolloClient, ApolloProvider } from '@apollo/client/index.js'
import React, { ReactNode, useState } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { StreamedHydration } from './StreamedHydration.js'

export default function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { ApolloConfig } = pageContext.config
  // TODO: assertUsage
  const [queryClient] = useState(() => new ApolloClient(ApolloConfig!(pageContext)))

  return (
    <ApolloProvider client={queryClient}>
      <StreamedHydration client={queryClient}>{children}</StreamedHydration>
    </ApolloProvider>
  )
}
