export { resolveSentryOptions }

import type { GlobalContext } from 'vike/types'
import type { SentryOptions } from '../types.js'

/** Merges the +sentry values (the most specific one wins) over the extension's defaults. */
async function resolveSentryOptions(globalContext: GlobalContext): Promise<SentryOptions> {
  const options: SentryOptions = {}
  for (const value of [...(globalContext.config.sentry ?? [])].reverse()) {
    Object.assign(options, typeof value === 'function' ? await value(globalContext) : value)
  }
  return {
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.2,
    ...options,
    dsn: options.dsn ?? import.meta.env.PUBLIC_ENV__SENTRY_DSN,
  }
}
