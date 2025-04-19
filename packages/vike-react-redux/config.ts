export { config as default }

import type { Config } from 'vike/types'
import type { Store } from '@reduxjs/toolkit'

const config = {
  name: 'vike-react-redux',
  require: {
    // TODO/now: bump
    vike: '>=0.4.228',
    'vike-react': '>=0.4.13',
  },

  passToClient: ['redux.ssrState'],

  meta: {
    redux: {
      env: { server: true, client: true },
      global: true,
    },
  },

  onCreatePageContext: 'import:vike-react-redux/__internal/onCreatePageContext:onCreatePageContext',
  onAfterRenderHtml: 'import:vike-react-redux/__internal/onAfterRenderHtml:onAfterRenderHtml',
  onBeforeRenderClient: 'import:vike-react-redux/__internal/onBeforeRenderClient:onBeforeRenderClient',
  Wrapper: 'import:vike-react-redux/__internal/Wrapper:Wrapper',
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      redux?: {
        createStore: (pageContext: PageContext) => Store
      }
    }
    interface PageContext {
      redux?: {
        ssrState?: Record<string, unknown>
      }
    }
    interface PageContextServer {
      redux?: {
        store: Store
      }
    }
    interface GlobalContextClient {
      redux?: {
        store: Store
      }
    }
  }
}
