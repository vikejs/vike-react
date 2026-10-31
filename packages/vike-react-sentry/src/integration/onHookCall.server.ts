export { onHookCall }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { traceHook } from './traceHook.js'

const onHookCall: Config['onHookCall'] = (hook, pageContext) => traceHook(SentryNode, hook, pageContext)
