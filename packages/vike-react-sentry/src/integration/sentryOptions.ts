export { resolveSentryOptions }

import type { GlobalContext } from 'vike/types'
import type { SentryOptions } from '../types.js'

/** Merges the +sentry values (the most specific one wins) over the extension's defaults. */
async function resolveSentryOptions<Options extends SentryOptions>(globalContext: GlobalContext): Promise<Options> {
  const options = { environment: import.meta.env.MODE } as Options
  for (const value of [...(globalContext.config.sentry ?? [])].reverse()) {
    Object.assign(options, typeof value === 'function' ? await value(globalContext) : value)
  }
  options.dsn ??= import.meta.env.PUBLIC_ENV__SENTRY_DSN
  return options
}
