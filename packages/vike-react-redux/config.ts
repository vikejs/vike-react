export { config as default }

import type { Config } from 'vike/types'
import type { Store } from '@reduxjs/toolkit'

const config = {
  name: 'vike-react-redux',
  require: {
    vike: '>=0.4.249',
    'vike-react': '>=0.6.3',
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
        createStore: (pageContext: PageContext | GlobalContextClient) => Store
      }
    }
    interface PageContext {
      // vike-react-redux only defines pageContext.redux.store on the server-side, but thanks to https://github.com/vikejs/vike/pull/2459 the store is also avaiable at pageContext.redux.store on the client-side: on the client-side pageContext.redux.store falls back to globalContext.store
      store: Store
      redux?: {
        ssrState?: Record<string, unknown>
      }
    }
    interface GlobalContextClient {
      store: Store
    }
  }
}
