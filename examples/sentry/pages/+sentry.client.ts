import { SentryReactOptions } from 'vike-react-sentry/types'
import type { GlobalContextClient } from 'vike/types'

export default function (globalContextClient: GlobalContextClient): SentryReactOptions {
  return {
    tracesSampleRate: 1,
  }
}
