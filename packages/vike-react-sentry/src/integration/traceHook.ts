export { traceHook }

import type * as SentryReact from '@sentry/react'
import type { PageContext } from 'vike/types'
import type { Hook } from './hookErrors.js'
import { isVikeControlFlow } from '../utils/isVikeControlFlow.js'

type Sentry = Pick<typeof SentryReact, 'isEnabled' | 'startSpan'>
type OnHookError = (error: unknown, hook: Hook, pageContext: PageContext | null) => void

/** Traces a Vike hook call, and passes its error to `onHookError()`. */
async function traceHook(Sentry: Sentry, hook: Hook, pageContext: PageContext | null, onHookError: OnHookError) {
  if (
    !Sentry.isEnabled() ||
    hook.name === 'onError' ||
    // +route functions run for every link Vike prefetches
    hook.name === 'route' ||
    // Set by Vike while prefetching a link (vike > 0.4.268)
    (pageContext as { isPrefetch?: boolean } | null)?.isPrefetch
  ) {
    // Vike keeps the hook's result and error, and (vike <= 0.4.268) logs whatever +onHookCall rejects with
    hook.call()
    return
  }

  await Sentry.startSpan(
    {
      name: hook.name,
      op: 'vike.hook',
      // Hooks running outside a page view (e.g. prefetching) would each become a transaction
      onlyIfParent: true,
      attributes: {
        'vike.hook.name': hook.name,
        'vike.hook.file': hook.filePath,
        'vike.page.id': pageContext?.pageId ?? undefined,
        'vike.url': pageContext?.urlOriginal,
      },
    },
    async (span) => {
      try {
        await hook.call()
      } catch (error) {
        if (isVikeControlFlow(error)) return
        span.setStatus({ code: 2, message: 'internal_error' })
        onHookError(error, hook, pageContext)
      }
    },
  )
}
