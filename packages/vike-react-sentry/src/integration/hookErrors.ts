export { rememberHook }
export { recallHook }
export { captureHookError }
export type { Hook }

import type * as SentryReact from '@sentry/react'
import type { Config, PageContext } from 'vike/types'

type Hook = Parameters<Extract<Config['onHookCall'], Function>>[0]

// Vike's +onError doesn't say which hook threw
const hookOfError = new WeakMap<object, Hook>()

function rememberHook(error: unknown, hook: Hook): void {
  if (typeof error === 'object' && error !== null) hookOfError.set(error, hook)
}

function recallHook(error: unknown): Hook | undefined {
  return typeof error === 'object' && error !== null ? hookOfError.get(error) : undefined
}

function captureHookError(
  Sentry: Pick<typeof SentryReact, 'captureException'>,
  error: unknown,
  hook?: Hook,
  pageContext?: PageContext | null,
): void {
  Sentry.captureException(error, {
    mechanism: { type: 'auto.function.vike', handled: false },
    captureContext: {
      tags: { 'vike.hook': hook?.name, 'vike.page': pageContext?.pageId ?? undefined },
      contexts: {
        vike: {
          hook: hook?.name,
          filePath: hook?.filePath,
          pageId: pageContext?.pageId,
          urlPathname: pageContext?.urlPathname,
        },
      },
    },
  })
}
