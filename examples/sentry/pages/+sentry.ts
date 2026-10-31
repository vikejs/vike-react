export { sentry as default }

import type { Config } from 'vike/types'
import { dsn, release } from '#sentry-env'

const sentry: Config['sentry'] = (globalContext) => ({
  dsn,
  release,
  initialScope: { tags: { side: globalContext.isClientSide ? 'client' : 'server' } },
})
