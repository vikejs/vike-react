export { onHookCall }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { rememberHook } from './hookErrors.js'
import { traceHook } from './traceHook.js'

// The error is sent by +onError
const onHookCall: Config['onHookCall'] = (hook, pageContext) => traceHook(SentryNode, hook, pageContext, rememberHook)
