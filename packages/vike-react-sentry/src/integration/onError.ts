import * as Sentry from '@sentry/node'
import { isErrorCaptured } from '../utils/error.js'
import type { Config } from 'vike/types'
import { assert } from '../utils/assert.js'

export const onError: Config['onError'] = (error) => {
  assert(
    error && typeof error === 'object' && 'getOriginalError' in error && typeof error.getOriginalError === 'function',
  )
  const original = error.getOriginalError()
  if (Sentry.getClient() && !isErrorCaptured(original)) {
    {
      Sentry.captureException(original)
    }
  }
}
