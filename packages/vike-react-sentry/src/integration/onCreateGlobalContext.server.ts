export { onCreateGlobalContext }

import * as SentryNode from '@sentry/node'
import type { GlobalContextServer } from 'vike/types'
import type { SentryOptions } from '../types.js'
import type { SentryNodeOptions } from '../types.js'
import { resolveDsn } from '../utils/resolveDsn.js'
import { TRACE_DEFAULT_SAMPLE_RATE } from './constants.js'

async function onCreateGlobalContext(globalContext: GlobalContextServer): Promise<void> {
  const sentryConfigs = globalContext.config.sentry || []

  const serverConfig: SentryOptions = {}
  for (const curr of [...sentryConfigs].reverse()) {
    const resolvedConfig = typeof curr === 'function' ? await curr() : curr
    Object.assign(serverConfig, resolvedConfig)
  }

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
