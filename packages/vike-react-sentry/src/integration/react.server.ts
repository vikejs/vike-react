export { react }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { captureHookError } from './hookErrors.js'

const react: Config['react'] = {
  renderToStreamOptions: {
    // React renders the boundary again on the client, so the error reaches no Vike hook
    onBoundaryError: (error) => captureHookError(SentryNode, error),
  },
}
