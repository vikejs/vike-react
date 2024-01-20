export type { Component }

import type { ReactElement } from 'react'
type Component = () => ReactElement

declare global {
  namespace Vike {
    interface PageContext {
      // Page is undefined in onRenderHtml() when setting the `ssr` config flag to `false`
      Page?: Component
      userAgent?: string
    }
  }
}
