export type { Component }

import type { ReactElement } from 'react'
type Component = () => ReactElement

declare global {
  namespace Vike {
    interface PageContext {
      Page?: Component
      userAgent?: string
    }
  }
}
