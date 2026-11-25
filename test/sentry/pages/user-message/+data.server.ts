export { data }

import * as Sentry from '@sentry/node'

async function data() {
  await new Promise((resolve) => setTimeout(resolve, 10))
  Sentry.captureMessage('USER_MESSAGE')
}
