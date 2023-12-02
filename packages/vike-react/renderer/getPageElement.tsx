export { getPageElement }

import React from 'react'
import type { PageContext } from 'vike/types'
import { PageContextProvider } from './PageContextProvider.js'

function getPageElement(pageContext: PageContext): JSX.Element {
  const Layout = pageContext.config.Layout ?? PassThrough
  const Wrapper =
    /* Should we implement this? Enabling users to defined a wrapper that is used across all layouts.
    pageContext.config.Wrapper ??
    */
    PassThrough
  const VikeReactQueryWrapper = pageContext.config.VikeReactQueryWrapper ?? PassThrough
  const { Page, pageProps } = pageContext
  const page = (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <VikeReactQueryWrapper pageContext={pageContext}>
          <Wrapper>
            <Layout>{Page ? <Page {...pageProps} /> : null}</Layout>
          </Wrapper>
        </VikeReactQueryWrapper>
      </PageContextProvider>
    </React.StrictMode>
  )
  return page
}

function PassThrough({ children }: any) {
  return <>{children}</>
}
