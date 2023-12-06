export type { Component, PageView }

import type { ReactElement } from 'react'
import type { Pipe } from 'react-streaming/dist/cjs/server/renderToStream/createPipeWrapper'

// type Component = (props: Record<string, unknown>) => ReactElement
type Component = (props: any) => ReactElement
type PageView = string | { _escaped: string } | StreamResult

type StreamResult = (
  | {
      pipe: Pipe
      readable: null
    }
  | {
      pipe: null
      readable: ReadableStream
    }
) & {
  streamEnd: Promise<boolean>
  disabled: boolean
  injectToStream: (chunk: unknown) => void
}

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
