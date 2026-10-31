export { resolveSentryOptions }

import type { GlobalContext } from 'vike/types'
import type { SentryOptions } from '../types.js'

/** Merges the +sentry values (the most specific one wins) over the extension's defaults. */
async function resolveSentryOptions<Options extends SentryOptions>(globalContext: GlobalContext): Promise<Options> {
  const defaults: SentryOptions = { environment: import.meta.env.MODE, tracesSampleRate: 0.2 }
  const options = { ...defaults } as Options
  for (const value of [...(globalContext.config.sentry ?? [])].reverse()) {
    Object.assign(options, typeof value === 'function' ? await value(globalContext) : value)
  }
  options.dsn ??= import.meta.env.PUBLIC_ENV__SENTRY_DSN
  return options
}
