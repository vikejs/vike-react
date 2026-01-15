export { config }

import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import vikePhoton from 'vike-photon/config'
import vikeReactSentry from 'vike-react-sentry/config'

const config = {
  title: 'Vike + React + Sentry Example',
  extends: [vikeReact, vikePhoton, vikeReactSentry],
  // Photon configuration
  photon: {
    server: '../server/index.ts',
  },
} satisfies Config
