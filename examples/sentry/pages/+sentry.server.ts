import { SentryNodeOptions } from 'vike-react-sentry/types'
import type { GlobalContextServer } from 'vike/types'

export default function (globalContextServer: GlobalContextServer): SentryNodeOptions {
  return {
    tracesSampleRate: 1,
  }
}
