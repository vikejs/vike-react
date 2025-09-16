export { getPageElement }

import React, { Suspense, useEffect, useState, Component } from 'react'
import type { PageContext } from 'vike/types'
import { PageContextProvider } from '../hooks/usePageContext.js'

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

  page = <PageContextProvider pageContext={pageContext}>{page}</PageContextProvider>

  let renderPromiseResolve!: () => void
  let renderPromiseReject!: (err: unknown) => void
  let renderPromise = new Promise<void>((resolve, reject) => {
    renderPromiseResolve = resolve
    renderPromiseReject = reject
  })
  const renderKey = Math.random()
  // @ts-ignore
  page = (
    <VikeReactErrorBoundary renderKey={renderKey} onError={renderPromiseReject}>
      <RenderPromiseProvider renderPromiseResolve={renderPromiseResolve}>{page}</RenderPromiseProvider>
    </VikeReactErrorBoundary>
  )

  if (pageContext.config.reactStrictMode !== false) {
    page = <React.StrictMode>{page}</React.StrictMode>
  }

  return { page, renderPromise }
}

// TODO/now rename
function RenderPromiseProvider({
  children,
  renderPromiseResolve,
}: { children: React.ReactNode; renderPromiseResolve: () => void }) {
  useEffect(renderPromiseResolve)
  return children
}

class VikeReactErrorBoundary extends Component {
  state = { hasError: null }

  static getDerivedStateFromError() {
    console.log('getDerivedStateFromError()')
    // @ts-ignore
    //this.props.onError(error)
    return { hasError: this.props.renderKey }
  }

  componentDidCatch(error: unknown, info: any) {
    console.log('componentDidCatch()')
    /*
    console.error(
      'EEEE',
      error,
      // Example "componentStack":
      //   in ComponentThatThrows (created by App)
      //   in ErrorBoundary (created by App)
      //   in div (created by App)
      //   in App
      info.componentStack,
      // Warning: `captureOwnerStack` is not available in production.
      React.captureOwnerStack(),
    );
    */
    // @ts-ignore
    this.props.onError(error)
  }

  render() {
    console.log('render')
    //*
    // @ts-ignore
    if (this.state.hasError === this.props.renderKey) {
      console.log('render 1')
      return <p>Couldn't render page.</p>
    }
    console.log('render 2')
    //*/
    // @ts-ignore
    return this.props.children
  }
}
