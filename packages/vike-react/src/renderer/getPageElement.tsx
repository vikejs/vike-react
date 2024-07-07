export { getPageElement }

import React, { Suspense } from 'react'
import type { PageContext } from 'vike/types'
import { PageContextProvider } from '../hooks/usePageContext.js'

function getPageElement(pageContext: PageContext): JSX.Element {
  const {
    Page,
    config: { Loading }
  } = pageContext
  let page = Page ? <Page /> : null

  // Wrapping
  ;[
    // Inner wrapping
    ...(pageContext.config.Layout || []),
    // Outer wrapping
    ...(pageContext.config.Wrapper || [])
  ].forEach((Wrapper) => {
    if (Loading) {
      page = <Suspense fallback={<Loading />}>{page}</Suspense>
    }
    page = <Wrapper>{page}</Wrapper>
  })
  if (Loading) {
    page = <Suspense fallback={<Loading />}>{page}</Suspense>
  }

  page = <PageContextProvider pageContext={pageContext}>{page}</PageContextProvider>
  if (pageContext.config.reactStrictMode !== false) {
    page = <React.StrictMode>{page}</React.StrictMode>
  }

  return page
}
