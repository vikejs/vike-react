export { config as default }

import type { Config } from 'vike/types'
import type { Store } from '@reduxjs/toolkit'

const config = {
  name: 'vike-react-redux',
  require: {
    vike: '>=0.4.211',
    'vike-react': '>=0.4.13',
  },
  passToClient: ['reduxState'],
  onAfterRenderHtml: 'import:vike-react-redux/__internal/onAfterRenderHtml:onAfterRenderHtml',
  // @ts-expect-error
  onCreatePageContext: 'import:vike-react-redux/__internal/onCreatePageContext:onCreatePageContext',
  onBeforeRenderClient: 'import:vike-react-redux/__internal/onBeforeRenderClient:onBeforeRenderClient',
  Wrapper: 'import:vike-react-redux/__internal/Wrapper:Wrapper',
  meta: {
    redux: {
      env: { server: true, client: true },
      global: true,
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      reduxStore?: Store
      reduxState?: Record<string, unknown>
      serverState?: Partial<PageContext['reduxState']>
    }
    interface Config {
      redux?: null | {
        createStore?: (preloadedState?: Record<string, unknown>) => PageContext['reduxStore']
      }
    }
  }
}
