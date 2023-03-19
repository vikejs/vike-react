export { getPageElement }

import type { PageContext } from './types'
import React from 'react'
import { PageContextProvider } from './usePageContext'

function getPageElement(pageContext: PageContext): JSX.Element {
  const Layout = pageContext.exports.Layout ?? PassThrough
  const Wrapper = pageContext.exports.Wrapper ?? PassThrough
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
