// https://vike.dev/pageContext#typescript
import type React from 'react'
import type { JSX } from 'react'
import type ReactDOM from 'react-dom/client'

declare global {
  namespace Vike {
    interface PageContext {
      Page?: () => React.ReactNode
      userAgent?: string
      page?: JSX.Element
      root?: ReactDOM.Root
    }
  }
}
