import { ApolloClient } from '@apollo/client-react-streaming'
import React, { Suspense, type ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { assertUsage } from '../utils/assertUsage.js'
import { WrappedApolloProvider } from './Transport.js'
import './styles.css'

export default function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { ApolloClient: getApolloClientOptions, Loading } = pageContext.config
  assertUsage(getApolloClientOptions, 'Setting +ApolloClient is required')
  let element = (
    <WrappedApolloProvider makeClient={() => new ApolloClient(getApolloClientOptions(pageContext))}>
      {children}
    </WrappedApolloProvider>
  )
  if (Loading) {
    element = <Suspense fallback={<Loading />}>{element}</Suspense>
  }

  return element
}
