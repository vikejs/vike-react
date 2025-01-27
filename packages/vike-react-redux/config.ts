export { config as default }
import type { Config } from 'vike/types'
import type { Store } from '@reduxjs/toolkit'

const config = {
  name: 'vike-react-redux',
  require: {
    vike: '>=0.4.211',
    'vike-react': '>=0.4.13',
  },
  passToClient: ['redux'],
  onAfterRenderHtml: 'import:vike-react-redux/__internal/onAfterRenderHtml:onAfterRenderHtml',
  onBeforeRenderHtml: 'import:vike-react-redux/__internal/onBeforeRenderHtml:onBeforeRenderHtml',
  onBeforeRenderClient: 'import:vike-react-redux/__internal/onBeforeRenderClient:onBeforeRenderClient',
  Wrapper: 'import:vike-react-redux/__internal/Wrapper:Wrapper',
  meta: {
    redux: {
      env: { server: true, client: true },
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      redux?: {
        state?: unknown
      }
    }
    interface Config {
      redux?: null | {
        createStore?: (preloadedState?: any) => Store
        store?: Store
      }
    }
  }
}
