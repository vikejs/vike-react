export { react }

import * as SentryReact from '@sentry/react'
import type { Config } from 'vike/types'

// After hydration, React reports render errors only to the root's callbacks
const rootOptions = {
  onUncaughtError: SentryReact.reactErrorHandler(),
  onCaughtError: SentryReact.reactErrorHandler(),
  onRecoverableError: SentryReact.reactErrorHandler(),
}

const react: Config['react'] = {
  hydrateRootOptions: rootOptions,
  createRootOptions: rootOptions,
}
