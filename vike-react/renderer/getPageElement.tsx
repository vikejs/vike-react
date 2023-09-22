export { getPageElement }

import React from 'react'
import { PageContextProvider } from './PageContextProvider.js'
import type { PageContext } from 'vite-plugin-ssr/types'

function getPageElement(pageContext: PageContext): JSX.Element {
  const Layout = pageContext.config.Layout ?? PassThrough
  const Wrapper =
    /* Should we implement this? Enabling users to defined a wrapper that is used across all layouts.
    pageContext.config.Wrapper ??
    */
    PassThrough
  const { Page, pageProps } = pageContext
  const page = (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Wrapper>
          <Layout>
            <Page {...pageProps} />
          </Layout>
        </Wrapper>
      </PageContextProvider>
    </React.StrictMode>
  )
  return page
}

function PassThrough({ children }: any) {
  return <>{children}</>
}
