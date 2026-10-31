export { config as default }

import { getViteConfig } from '../plugin/index.js'
import type { Config, ImportString } from 'vike/types'
import type { SentryOptions, SentryOptionsFactory } from '../types.js'
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
  // Vike accepts one pointer import per environment, but vike-react's type of +react lists only one
  react: [
    'import:vike-react-sentry/__internal/integration/react.server:react',
    'import:vike-react-sentry/__internal/integration/react.client:react',
  ] as unknown as ImportString,
  meta: {
    sentry: {
      env: {
        server: true,
        client: true,
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
      sentry?: SentryOptions | SentryOptionsFactory
      sentryVite?: SentryVitePluginOptions
    }

    interface ConfigResolved {
      sentry?: (SentryOptions | SentryOptionsFactory)[]
      sentryVite?: SentryVitePluginOptions
    }
  }
}
