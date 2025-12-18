export { Wrapper }

import React, { type ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { assertUsage } from '../utils/assert.js'
import { createWrappedApolloProvider } from './Transport.js'
import type { PageContextServer } from 'vike/types'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { ApolloClient: getApolloClient } = pageContext.config
  assertUsage(getApolloClient, 'Setting +ApolloClient is required')
  const WrappedApolloProvider = createWrappedApolloProvider(pageContext as PageContextServer)
  return <WrappedApolloProvider makeClient={() => getApolloClient(pageContext)}>{children}</WrappedApolloProvider>
}
