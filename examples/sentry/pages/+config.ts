export { config }

import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import vikePhoton from 'vike-photon/config'
import vikeReactSentry from 'vike-react-sentry/config'

const config = {
  title: 'Vike + React + Sentry Example',
  extends: [vikeReact, vikePhoton, vikeReactSentry],
  sentry: {
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  },
  // Photon configuration
  photon: {
    server: '../server/index.ts',
  },
} satisfies Config
