export { config }

import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import vikePhoton from 'vike-photon/config'
import vikeReactSentry from 'vike-react-sentry/config'
import { myIntegration } from './my-ingetration'

const config = {
  title: 'Vike + React + Sentry Example',
  extends: [vikeReact, vikePhoton, vikeReactSentry],
  sentry: {
    tracesSampleRate: 1.0,
    dsn: "https://8de66fe8dda3a86d986df8ee3aa09f72@o4510438936412161.ingest.de.sentry.io/4510438941655120"
  },
  // Photon configuration
  photon: {
    server: '../server/index.ts',
  },
} satisfies Config
