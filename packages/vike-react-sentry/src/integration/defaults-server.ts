import { SentryNodeOptions } from '../types.js'
import { resolveDsn } from '../utils/resolveDsn.js'
import { TRACE_DEFAULT_SAMPLE_RATE, TRACE_DEFAULT_SAMPLE_RATE_ERROR } from './constants.js'

export const DEFAULT_SENTRY_SERVER_SETTINGS = (serverConfig: SentryNodeOptions) =>
  ({
    environment: serverConfig.environment || import.meta.env.MODE || 'production',
    dsn: resolveDsn(serverConfig.dsn),
    tracesSampler: (samplingContext) => {
      const { attributes, inheritOrSampleWith } = samplingContext
      if (attributes?.hasRecentErrors === true) {
        return TRACE_DEFAULT_SAMPLE_RATE_ERROR
      }
      return inheritOrSampleWith(serverConfig.tracesSampleRate || TRACE_DEFAULT_SAMPLE_RATE)
    },
  }) as SentryNodeOptions
