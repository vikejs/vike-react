export { getViteConfig }

import { serverProductionEntryPlugin } from '@brillout/vite-plugin-server-entry/plugin'
import type { InlineConfig } from 'vite'
import { sourceMapsPlugin } from './sourceMaps.js'

function getViteConfig(): InlineConfig {
  return {
    resolve: {
      noExternal: 'vike-react-sentry',
    },
    plugins: [
      ...serverProductionEntryPlugin({
        getServerProductionEntry: () => {
          return `
// vike-react-sentry: Preload OpenTelemetry instrumentation for ESM
// The actual Sentry.init() with config will be called later via onCreateGlobalContext
// https://docs.sentry.io/platforms/javascript/guides/node/install/esm-without-import/
import { preloadOpenTelemetry } from '@sentry/node';
preloadOpenTelemetry();
`
        },
        libraryName: 'vike-react-sentry',
      }),
      sourceMapsPlugin(),
    ],
  }
}
