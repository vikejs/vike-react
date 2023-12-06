export type { Component, PageView }

import type { ReactElement } from 'react'
import { renderToStream } from 'react-streaming/server'

// type Component = (props: Record<string, unknown>) => ReactElement
type Component = (props: any) => ReactElement
type PageView = string | { _escaped: string } | Awaited<ReturnType<typeof renderToStream>>

declare global {
  namespace Vike {
    interface PageContext {
      // Note: Page will typically be undefined in onRenderHtml() when setting the `ssr` config flag
      // to `false` (SPA mode).
      Page?: Component

      /** Properties of the page's root React component. */
      pageProps?: Record<string, unknown>

      /** &lt;title>${title}&lt;/title> - has precedence over the config */
      title?: string
      userAgent?: string
    }
  }
}
