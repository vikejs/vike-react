export { getPageElement }

import React, { type ReactNode } from 'react'
import type { PageContext } from 'vike/types'
import { PageContextProvider } from '../hooks/usePageContext.js'

function getPageElement(pageContext: PageContext): JSX.Element {
  const Layout = pageContext.config.Layout ?? PassThrough
  const Wrapper = pageContext.config.Wrapper ?? PassThrough
  const VikeReactQueryWrapper = pageContext.config.VikeReactQueryWrapper ?? (PassThrough as any)
  const { Page } = pageContext
  const page = (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <VikeReactQueryWrapper pageContext={pageContext}>
          <Wrapper>
            <Layout>{Page ? <Page /> : null}</Layout>
          </Wrapper>
        </VikeReactQueryWrapper>
      </PageContextProvider>
    </React.StrictMode>
  )
  return page
}

function PassThrough({ children }: { children: ReactNode }) {
  return <>{children}</>
}
