export { onCreateGlobalContext }

import * as SentryNode from '@sentry/node'
import type { GlobalContextServer } from 'vike/types'
import { SentryOptions } from '../types.js'
import { SentryNodeOptions } from '../types.js'
import { resolveDsn } from '../utils/resolveDsn.js'
import { TRACE_DEFAULT_SAMPLE_RATE } from './constants.js'

async function onCreateGlobalContext(globalContext: GlobalContextServer): Promise<void> {
  const serverConfig = (globalContext.config.sentry || []).reverse().reduce((acc, curr) => {
    if (typeof curr === 'function') {
      curr = curr(globalContext)
    }
    return { ...acc, ...curr }
  }, {}) as SentryOptions

  if (!SentryNode.getClient()) {
    SentryNode.init(resolveSentryServerSettings(serverConfig))
  }
}

const resolveSentryServerSettings = (serverConfig: SentryNodeOptions) =>
  ({
    environment: serverConfig.environment || import.meta.env.MODE || 'production',
    dsn: resolveDsn(serverConfig.dsn),
    traceSampleRate: serverConfig.tracesSampleRate ?? TRACE_DEFAULT_SAMPLE_RATE,
    ...serverConfig,
  }) as SentryNodeOptions
