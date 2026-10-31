export { onHookCall }

import * as SentryReact from '@sentry/react'
import type { Config } from 'vike/types'
import { traceHook } from './traceHook.js'

const onHookCall: Config['onHookCall'] = (hook, pageContext) => traceHook(SentryReact, hook, pageContext)
