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
  // TODO/next-major-release: remove pageProps (i.e. tell users to use data() instead of onBeforeRender() to fetch data)
  const { Page, pageProps } = pageContext
  if (pageProps) {
    console.warn('[vike-react][warning] pageContext.pageProps is deprecated, use a data() hook instead. See https://vike.dev/useData')
  }
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
