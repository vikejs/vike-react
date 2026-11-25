export { sentry as default }

import * as Sentry from '@sentry/react'
import type { Config } from 'vike/types'

const sentry: Config['sentry'] = {
  integrations: [Sentry.httpClientIntegration()],
}
