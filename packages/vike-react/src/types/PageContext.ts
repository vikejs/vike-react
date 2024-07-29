import type React from 'react'
import type { JSX } from 'react'
import type ReactDOM from 'react-dom/client'
import type { ConfigFromHookResolved } from './Config.js'
import type { PageContext } from 'vike/types'

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      /** The root React component of the page */
      Page?: () => React.ReactNode
      /** The root React element of the page */
      page?: JSX.Element
      /** The React root DOM container */
      root?: ReactDOM.Root
    }
  }
}

// vike-react internal usage
export type PageContextInternal = PageContext & {
  _configFromHook?: ConfigFromHookResolved
  _headAlreadySet?: true
}
