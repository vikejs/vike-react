export { onHookCall }

import * as SentryReact from '@sentry/react'
import type { Config } from 'vike/types'
import { captureHookError } from './hookErrors.js'
import { traceHook } from './traceHook.js'

// Vike has no client-side +onError
const onHookCall: Config['onHookCall'] = (hook, pageContext) =>
  traceHook(SentryReact, hook, pageContext, (error) => captureHookError(SentryReact, error, hook, pageContext))
