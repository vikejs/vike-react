export { config as default }

import type { Config } from 'vike/types'
import { getViteConfig } from '../plugin/index.js'
import 'vike-react/config'
import { SentryOptions } from '../types.js'
import { SentryVitePluginOptions } from '@sentry/vite-plugin'

const config = {
  name: 'vike-react-sentry',
  require: {
    'vike-react': '>=0.6.4',
  },
  Head: 'import:vike-react-sentry/__internal/integration/Head:Head',
  onCreateGlobalContext: 'import:vike-react-sentry/__internal/integration/onCreateGlobalContext:onCreateGlobalContext',
  onError: 'import:vike-react-sentry/__internal/integration/onError:onError',
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
  },
  vite: getViteConfig,
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      sentry?: SentryOptions
    }

    interface ConfigResolved {
      sentry?: SentryOptions[]
    }
  }
}
