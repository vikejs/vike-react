export { react }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { captureHookError } from './hookErrors.js'
import { isVikeControlFlow } from '../utils/isVikeControlFlow.js'

const react: Config['react'] = {
  renderToStreamOptions: {
    // React renders the boundary again on the client, so the error reaches no Vike hook
    onBoundaryError: (error) => {
      // React also passes an error outside a boundary, which +onError has sent: Sentry skips an error it captured
      if (isVikeControlFlow(error)) return
      captureHookError(SentryNode, error)
    },
  },
}
