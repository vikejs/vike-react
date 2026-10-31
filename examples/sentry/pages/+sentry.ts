export { sentry as default }

import type { Config } from 'vike/types'
import { release } from '#sentry-env'

const sentry: Config['sentry'] = () => ({
  release,
})
