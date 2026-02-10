export { onCreateGlobalContext }

import * as SentryReact from '@sentry/react'
import type { GlobalContextClient } from 'vike/types'
import { SentryOptions } from '../types.js'
import { SentryReactOptions } from '../types.js'
import { resolveDsn } from '../utils/resolveDsn.js'
import { TRACE_DEFAULT_SAMPLE_RATE } from './constants.js'

async function onCreateGlobalContext(globalContext: GlobalContextClient): Promise<void> {
  const clientConfig = (globalContext.config.sentry || []).reverse().reduce((acc, curr) => {
    if (typeof curr === 'function') {
      curr = curr(globalContext)
    }
    return { ...acc, ...curr }
  }, {}) as SentryOptions

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
