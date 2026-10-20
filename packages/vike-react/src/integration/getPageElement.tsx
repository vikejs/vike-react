export { getPageElement }

import React, { Suspense, useEffect } from 'react'
import type { PageContext } from 'vike/types'
import { VikeReactProviderPageContext } from '../hooks/usePageContext.js'

function getPageElement(pageContext: PageContext) {
  const {
    Page,
    config: { Loading },
  } = pageContext
  let page = Page ? <Page /> : null

  // Wrapping
  const addSuspense = (el: React.JSX.Element | null) => {
    if (!Loading?.layout) return el
    return <Suspense fallback={<Loading.layout />}>{page}</Suspense>
  }
  page = addSuspense(page)
  ;[
    // Inner wrapping
    ...(pageContext.config.Layout || []),
    // Outer wrapping
    ...(pageContext.config.Wrapper || []),
  ].forEach((Wrap) => {
    page = <Wrap>{page}</Wrap>
    page = addSuspense(page)
  })

  // Workaround: called, not rendered. Because rendering it might throw an error upon client-side navigation in development. (React's dev performance track reads every key of a component's previous props, and pageContext throws upon reading a key Vike couldn't serialize.)
  // https://github.com/vikejs/vike-react/pull/234
  // TO-DO/eventually: remove the workaround after https://github.com/react/react/pull/36867 is merged
  page = VikeReactProviderPageContext({ pageContext, children: page })
  // page = <VikeReactProviderPageContext pageContext={pageContext}>{page}</VikeReactProviderPageContext>

  let renderPromiseResolve!: () => void
  let renderPromiseReject!: (err: unknown) => void
  let renderPromise = new Promise<void>((resolve, reject) => {
    renderPromiseResolve = resolve
    renderPromiseReject = reject
  })
  page = (
    <VikeReactProviderRenderPromise renderPromiseResolve={renderPromiseResolve}>{page}</VikeReactProviderRenderPromise>
  )

  if (pageContext.config.reactStrictMode !== false) {
    page = <React.StrictMode>{page}</React.StrictMode>
  }

  return { page, renderPromise, renderPromiseReject }
}

function VikeReactProviderRenderPromise({
  children,
  renderPromiseResolve,
}: { children: React.ReactNode; renderPromiseResolve: () => void }) {
  useEffect(renderPromiseResolve)
  return children
}
