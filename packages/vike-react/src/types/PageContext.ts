import type React from 'react'
import type ReactDOM from 'react-dom/client'
import type { ConfigFromHookResolved } from './Config.js'
import type { PageHtmlStream } from '../integration/onRenderHtml.js'

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      /** The root React component of the page */
      Page?: () => React.ReactNode
      /** The root React element of the page */
      page?: React.JSX.Element
      /** The React root DOM container */
      root?: ReactDOM.Root

      /** The +Page.jsx component rendered to the HTML string. */
      pageHtmlString?: string
      /** The +Pagejsx component rendered to an HTML stream. */
      pageHtmlStream?: PageHtmlStream
    }
  }
}

// Internal usage
export type PageContextInternal = {
  _configFromHook?: ConfigFromHookResolved
  _headAlreadySet?: boolean
}
