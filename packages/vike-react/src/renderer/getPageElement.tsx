export { getPageElement }

import React, { type ReactNode } from 'react'
import type { PageContext } from 'vike/types'
import { PageContextProvider } from '../hooks/usePageContext.js'

function getPageElement(pageContext: PageContext): JSX.Element {
  // Main component
  const Layout = pageContext.config.Layout ?? PassThrough
  const { Page } = pageContext
  let page = <Layout>{Page ? <Page /> : null}</Layout>

  // Wrapper components
  ;(pageContext.config.Wrapper || []).forEach((Wrapper) => {
    page = <Wrapper>{page}</Wrapper>
  })
  page = <PageContextProvider pageContext={pageContext}>{page}</PageContextProvider>
  if (pageContext.config.reactStrictMode !== false) {
    page = <React.StrictMode>{page}</React.StrictMode>
  }

  return page
}

function PassThrough({ children }: { children: ReactNode }) {
  return <>{children}</>
}
