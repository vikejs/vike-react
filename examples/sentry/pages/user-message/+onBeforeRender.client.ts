export { onBeforeRender }

import * as Sentry from '@sentry/react'

async function onBeforeRender() {
  await new Promise((resolve) => setTimeout(resolve, 10))
  Sentry.captureMessage('USER_MESSAGE_CLIENT')
}
