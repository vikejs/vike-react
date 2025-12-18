export { onError }

import * as Sentry from '@sentry/node'

// Handle errors on the server side
function onError(error: unknown): void {
  // Only capture if Sentry is initialized
  if (Sentry.getClient()) {
    Sentry.captureException(error)
  }
}
