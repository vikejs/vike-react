export { sentry as default }

import type { Config } from 'vike/types'
import { release } from '#sentry-env'

const sentry: Config['sentry'] = (globalContext) => ({
  release,
  initialScope: { tags: { side: globalContext.isClientSide ? 'client' : 'server' } },
})
