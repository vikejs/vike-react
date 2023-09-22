export type { Component }

import type { ReactElement } from 'react'

// type Component = (props: Record<string, unknown>) => ReactElement
type Component = (props: any) => ReactElement

declare global {
  namespace Vike {
    interface PageContext {
      Page: Component
      pageProps: Record<string, unknown>
    }
  }
}
