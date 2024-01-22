import type { Component } from './Component.js'

// https://vike.dev/pageContext#typescript
declare global {
  namespace Vike {
    interface PageContext {
      Page?: Component
      userAgent?: string
    }
  }
}
