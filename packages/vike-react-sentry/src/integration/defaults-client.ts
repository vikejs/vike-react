import { SentryReactOptions } from '../types.js'
import { resolveDsn } from '../utils/resolveDsn.js'
import * as SentryReact from '@sentry/react'
import { TRACE_DEFAULT_SAMPLE_RATE, TRACE_DEFAULT_SAMPLE_RATE_ERROR } from './constants.js'

export const DEFAULT_SENTRY_CLIENT_SETTINGS = (clientConfig: SentryReactOptions) =>
  ({
    environment: clientConfig.environment || import.meta.env.MODE || 'production',
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [SentryReact.browserTracingIntegration(), SentryReact.replayIntegration()],
    dsn: resolveDsn(clientConfig.dsn),
    tracesSampler: (samplingContext) => {
      const { attributes, inheritOrSampleWith } = samplingContext
      if (attributes?.hasRecentErrors === true) {
        return TRACE_DEFAULT_SAMPLE_RATE_ERROR
      }
      return inheritOrSampleWith(clientConfig.tracesSampleRate || TRACE_DEFAULT_SAMPLE_RATE)
    },
  }) as SentryReactOptions
