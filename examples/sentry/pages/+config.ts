export { config }

import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'
import vikeReactSentry from 'vike-react-sentry/config'

const config = {
  title: 'Vike + React + Sentry Example',
  extends: [vikeReact, vikeReactSentry],
  server: true
} satisfies Config
