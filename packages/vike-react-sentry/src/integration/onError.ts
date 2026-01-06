import * as Sentry from '@sentry/node'
import { isErrorSeen } from '../utils/error.js'
import type { Config } from 'vike/types'
import { assert } from '../utils/assert.js'

// Handle errors on the server side
export const onError: Config['onError'] = (error) => {
  assert(
    error && typeof error === 'object' && 'getOriginalError' in error && typeof error.getOriginalError === 'function',
  )
  const original = error.getOriginalError()
  if (Sentry.getClient() && !isErrorSeen(original)) {
    {
      Sentry.captureException(original)
    }
  }
}
