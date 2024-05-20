import type React from 'react'
import type { JSX } from 'react'
import type ReactDOM from 'react-dom/client'

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
