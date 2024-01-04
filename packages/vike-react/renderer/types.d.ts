export type { Component }

import type { ReactElement } from 'react'

// type Component = (props: Record<string, unknown>) => ReactElement
type Component = (props: any) => ReactElement

declare global {
  namespace Vike {
    interface PageContext {
      // Note: Page will typically be undefined in onRenderHtml() when setting the `ssr` config flag
      // to `false` (SPA mode).
      Page?: Component

      // TODO/next-major-release: remove pageProps (i.e. tell users to use data() instead of onBeforeRender() to fetch data)
      /** Properties of the page's root React component - e.g. set by onBeforeRender() hook */
      pageProps?: Record<string, unknown>

      // TODO/next-major-release: remove support for setting title over onBeforeRender()
      /** &lt;title>${title}&lt;/title> - set by onBeforeRender() hook, has precedence over the config */
      title?: string

      lang?: string

      userAgent?: string

      // Needed by getTitle()
      data?: {
        /** &lt;title>${title}&lt;/title> - set by data() hook, has precedence over the onBeforeRender() hook */
        title?: string
      }
    }
  }
}
