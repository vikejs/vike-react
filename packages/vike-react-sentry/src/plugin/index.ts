export { getViteConfig }

import { serverProductionEntryPlugin } from '@brillout/vite-plugin-server-entry/plugin'
import { loadEnv, type InlineConfig } from 'vite'
import { sourceMapsPlugin } from './sourceMaps.js'
import { assertUsage } from '../utils/assert.js'

function getViteConfig(): InlineConfig {
  return {
    resolve: {
      noExternal: 'vike-react-sentry',
    },
    optimizeDeps: {
      // Vite sees this extension's client code only once the browser loads it, and pre-bundling a dependency then reloads the page
      exclude: ['vike-react-sentry'],
      include: ['@sentry/react'],
    },
    plugins: [
      ...serverProductionEntryPlugin({
        getServerProductionEntry: () => {
          return `
// vike-react-sentry: Preload OpenTelemetry instrumentation for ESM
// The actual Sentry.init() with config will be called later via onCreateGlobalContext
// https://docs.sentry.io/platforms/javascript/guides/node/install/esm-without-import/
// @sentry/node 11 has no preloadOpenTelemetry(): its instrumentation is channel-based and needs no preload
import * as Sentry from '@sentry/node';
Sentry.preloadOpenTelemetry?.();
`
        },
        libraryName: 'vike-react-sentry',
      }),
      sourceMapsPlugin(),
      {
        name: 'vike-react-sentry:dsn',
        configResolved(config) {
          // Vike adds .env values to process.env in its own configResolved(), which can run after this one
          const env = loadEnv(config.mode, config.envDir, 'SENTRY_DSN')
          assertUsage(
            !env['SENTRY_DSN'],
            'SENTRY_DSN is not supported: unset it, and set PUBLIC_ENV__SENTRY_DSN or dsn in +sentry instead.',
          )
        },
      },
    ],
  }
}
