import React, { type ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { assertUsage } from '../utils/assertUsage.js'
import { WrappedApolloProvider } from './Transport.js'

export default function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { ApolloClient: getApolloClient } = pageContext.config
  assertUsage(getApolloClient, 'Setting +ApolloClient is required')
  return <WrappedApolloProvider makeClient={() => getApolloClient(pageContext)}>{children}</WrappedApolloProvider>
}
