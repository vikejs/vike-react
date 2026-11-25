export { sentry as default }

import type { Config } from 'vike/types'

const sentry: Config['sentry'] = (globalContext) => ({
  // Without it, vike-react-sentry reads PUBLIC_ENV__SENTRY_DSN
  dsn: import.meta.env.VITE_SENTRY_DSN,
  // With enabled: false, no DSN is needed
  enabled: import.meta.env.VITE_SENTRY_ENABLED !== 'false',
  initialScope: { tags: { side: globalContext.isClientSide ? 'client' : 'server' } },
})
