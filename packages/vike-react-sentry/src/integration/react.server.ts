export { react }

import * as SentryNode from '@sentry/node'
import type { Config } from 'vike/types'
import { captureHookError, isThrownByHook } from './hookErrors.js'
import { isVikeControlFlow } from '../utils/isVikeControlFlow.js'

const react: Config['react'] = {
  renderToStreamOptions: {
    // React renders the boundary again on the client, so the error reaches no Vike hook
    onBoundaryError: (error) => {
      // React also passes an error outside a boundary, which fails onRenderHtml() before react-streaming calls this
      if (isThrownByHook(error) || isVikeControlFlow(error)) return
      captureHookError(SentryNode, error)
    },
  },
}
