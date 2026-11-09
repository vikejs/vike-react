export { react }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { isVikeControlFlow } from '../utils/isVikeControlFlow.js'
import { isAbortSignalError } from '../utils/isAbortSignalError.js'

const react: Config['react'] = (pageContext) => {
  // Fired by Vike when the client disconnects (vike >= 0.4.269)
  const abortSignal = (pageContext as { abortSignal?: AbortSignal }).abortSignal
  return {
    renderToStreamOptions: {
      // React renders the boundary again on the client, so the error reaches no Vike hook
      onBoundaryError: (error) => {
        // React also passes an error outside a boundary, which +onError has sent: Sentry skips an error it captured
        if (isVikeControlFlow(error) || isAbortSignalError(error, abortSignal)) return
        SentryNode.captureException(error)
      },
    },
  }
}
