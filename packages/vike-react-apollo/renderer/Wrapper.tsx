import React, { Suspense, type ReactNode } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import { assertUsage } from '../utils/assertUsage.js'
import { WrappedApolloProvider } from './Transport.js'
import './styles.css'

export default function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { ApolloClient: getApolloClient, Loading } = pageContext.config
  assertUsage(getApolloClient, 'Setting +ApolloClient is required')
  let element = (
    <WrappedApolloProvider makeClient={() => getApolloClient(pageContext)}>{children}</WrappedApolloProvider>
  )
  if (Loading) {
    element = <Suspense fallback={<Loading />}>{element}</Suspense>
  }

  return element
}
