export { config as default }

import { getViteConfig } from '../plugin/index.js'
import type { Config } from 'vike/types'
import type { SentryOptions } from '../types.js'
import type { SentryVitePluginOptions } from '@sentry/vite-plugin'
import 'vike-react/config' // Needed for merging vike-react's Vike.Config

const config = {
  name: 'vike-react-sentry',
  require: {
    'vike-react': '>=0.6.4',
    vike: '>=0.4.253',
  },
  Head: 'import:vike-react-sentry/__internal/integration/Head:Head',
  onCreateGlobalContext: [
    'import:vike-react-sentry/__internal/integration/onCreateGlobalContext.server:onCreateGlobalContext',
    'import:vike-react-sentry/__internal/integration/onCreateGlobalContext.client:onCreateGlobalContext',
  ],
  onError: 'import:vike-react-sentry/__internal/integration/onError:onError',
  onHookCall: [
    'import:vike-react-sentry/__internal/integration/onHookCall.server:onHookCall',
    'import:vike-react-sentry/__internal/integration/onHookCall.client:onHookCall',
  ],
  meta: {
    sentry: {
      env: {
        server: true,
        client: true,
        config: true,
      },
      global: true,
      cumulative: true,
    },
    sentryVite: {
      env: {
        server: false,
        client: false,
        config: true,
      },
      global: true,
      cumulative: false,
    },
  },
  vite: getViteConfig,
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      sentry?: SentryOptions | (() => SentryOptions | Promise<SentryOptions>)
      sentryVite?: SentryVitePluginOptions
    }

    interface ConfigResolved {
      sentry?: (SentryOptions | (() => SentryOptions | Promise<SentryOptions>))[]
      sentryVite?: SentryVitePluginOptions
    }
  }
}
