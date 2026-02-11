export { onCreateGlobalContext }

import * as SentryReact from '@sentry/react'
import type { GlobalContextClient } from 'vike/types'
import type { SentryOptions } from '../types.js'
import type { SentryReactOptions } from '../types.js'
import { resolveDsn } from '../utils/resolveDsn.js'
import { TRACE_DEFAULT_SAMPLE_RATE } from './constants.js'

async function onCreateGlobalContext(globalContext: GlobalContextClient): Promise<void> {
  const sentryConfigs = globalContext.config.sentry || []

  const clientConfig: SentryOptions = {}
  for (const curr of sentryConfigs.reverse()) {
    const resolvedConfig = typeof curr === 'function' ? await curr() : curr
    Object.assign(clientConfig, resolvedConfig)
  }

  if (!SentryReact.getClient()) {
    SentryReact.init(resolveSentryClientSettings(clientConfig))
  }
}

const resolveSentryClientSettings = (clientConfig: SentryReactOptions) =>
  ({
    environment: clientConfig.environment || import.meta.env.MODE || 'production',
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [SentryReact.browserTracingIntegration(), SentryReact.replayIntegration()],
    dsn: resolveDsn(clientConfig.dsn),
    traceSampleRate: clientConfig.tracesSampleRate ?? TRACE_DEFAULT_SAMPLE_RATE,
    ...clientConfig,
  }) as SentryReactOptions
