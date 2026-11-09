export { onHookCall }

import * as SentryReact from '@sentry/react'
import type { Config } from 'vike/types'
import { captureHookError } from './hookErrors.js'
import { traceHook } from './traceHook.js'
import { watchAbortSignal } from './abortReasons.js'

const onHookCall: Config['onHookCall'] = (hook, pageContext) => {
  // Every page's hooks run here, +onRenderClient included: it sees the abortSignal of every page React renders
  watchAbortSignal(pageContext)
  // Vike has no client-side +onError
  return traceHook(SentryReact, hook, pageContext, (error) => captureHookError(SentryReact, error, hook, pageContext))
}
