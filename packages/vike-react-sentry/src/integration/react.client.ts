export { react }

import * as SentryReact from '@sentry/react'
import type { Config } from 'vike/types'

// These callbacks replace React's defaults, which log the error. (vike-react logs uncaught errors itself, and React's
// default for recoverable errors, window.reportError(), would make Sentry's global handler send them a second time.)
const logError = (error: unknown) => console.error(error)

// After hydration, React reports render errors only to the root's callbacks
const rootOptions = {
  onUncaughtError: SentryReact.reactErrorHandler(),
  onCaughtError: SentryReact.reactErrorHandler(logError),
  onRecoverableError: SentryReact.reactErrorHandler(logError),
}

const react: Config['react'] = {
  hydrateRootOptions: rootOptions,
  createRootOptions: rootOptions,
}
