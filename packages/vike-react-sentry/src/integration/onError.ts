import * as Sentry from '@sentry/node'
import type { Config } from 'vike/types'
import { assert } from '../utils/assert.js'

export const onError: Config['onError'] = (error) => {
  if (!Sentry.getClient()) return
  assert(error && typeof error === 'object')
  Sentry.captureException(error)
}
