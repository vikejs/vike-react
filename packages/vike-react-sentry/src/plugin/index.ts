export { getViteConfig }

import { serverProductionEntryPlugin } from '@brillout/vite-plugin-server-entry/plugin'
import type { InlineConfig } from 'vite'
import { sourceMapsPlugin } from './sourceMaps.js'

function getViteConfig(): InlineConfig {
  return {
    resolve: {
      noExternal: 'vike-react-sentry',
    },
    optimizeDeps: {
      // When this extension is linked instead of installed, Vite finds @sentry/react only once the browser loads its client code, and reloads the page
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
    ],
  }
}
