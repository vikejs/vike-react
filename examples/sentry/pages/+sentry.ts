export { sentry as default }

import type { Config } from 'vike/types'

const sentry: Config['sentry'] = (globalContext) => ({
  // Without it, vike-react-sentry reads PUBLIC_ENV__SENTRY_DSN
  dsn: import.meta.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
  initialScope: { tags: { side: globalContext.isClientSide ? 'client' : 'server' } },
})
