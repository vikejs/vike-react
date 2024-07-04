import { ApolloClient } from '@apollo/client-react-streaming'
import React, { type ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { assertUsage } from '../utils/assertUsage.js'
import { WrappedApolloProvider } from './Transport.js'

export default function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { ApolloClient: getApolloClientOptions } = pageContext.config
  assertUsage(getApolloClientOptions, 'Setting +ApolloClient is required')
  return (
    <WrappedApolloProvider makeClient={() => new ApolloClient(getApolloClientOptions(pageContext))}>
      {children}
    </WrappedApolloProvider>
  )
}
