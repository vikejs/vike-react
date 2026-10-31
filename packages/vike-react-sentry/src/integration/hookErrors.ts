export { rememberHook }
export { recallThrow }
export { captureHookError }
export { getHookScope }
export type { Hook }

import type * as SentryReact from '@sentry/react'
import type { Config, PageContext } from 'vike/types'

type Hook = Parameters<Extract<Config['onHookCall'], Function>>[0]

// Vike's +onError doesn't say which hook threw, and by then Vike's logger may have changed the error's message (its
// log line, a hint) and stack (also Vite's source maps, in development)
const thrownErrors = new WeakMap<object, { hook: Hook; message: string | undefined }>()

function rememberHook(error: unknown, hook: Hook): void {
  if (typeof error !== 'object' || error === null) return
  thrownErrors.set(error, { hook, message: error instanceof Error ? error.message : undefined })
}

/**
 * What the hook threw, and the hook: an error with the message it was thrown with and its current stack frames, or
 * a thrown string (or other non-object) as is.
 */
function recallThrow(error: unknown): { error: unknown; hook?: Hook } {
  const thrown = typeof error === 'object' && error !== null ? thrownErrors.get(error) : undefined
  if (!thrown) {
    // Vike (>= 0.4.268, in development) passes an error of its own for a thrown non-object, and keeps the value
    const getOriginalError = (error as { getOriginalError?: unknown } | null)?.getOriginalError
    const original: unknown = typeof getOriginalError === 'function' ? getOriginalError() : error
    return { error: typeof original === 'object' && original !== null ? error : original }
  }
  if (!(error instanceof Error) || thrown.message === undefined) return { error, hook: thrown.hook }
  const frames = (error.stack ?? '').split('\n').filter((line) => /^\s+at /.test(line))
  const errorAsThrown: Error = Object.create(Object.getPrototypeOf(error), Object.getOwnPropertyDescriptors(error))
  Object.defineProperties(errorAsThrown, {
    message: { value: thrown.message, writable: true, configurable: true },
    stack: { value: [`${error.name}: ${thrown.message}`, ...frames].join('\n'), writable: true, configurable: true },
  })
  return { error: errorAsThrown, hook: thrown.hook }
}

function captureHookError(
  Sentry: Pick<typeof SentryReact, 'captureException'>,
  error: unknown,
  hook?: Hook,
  pageContext?: PageContext | null,
): void {
  Sentry.captureException(error, {
    mechanism: { type: 'auto.function.vike', handled: false },
    captureContext: getHookScope(hook, pageContext),
  })
}

function getHookScope(
  hook?: Hook,
  pageContext?: PageContext | null,
): { tags: Record<string, string | undefined>; contexts: Record<string, Record<string, unknown>> } {
  return {
    tags: { 'vike.hook': hook?.name, 'vike.page': pageContext?.pageId ?? undefined },
    contexts: {
      vike: {
        hook: hook?.name,
        filePath: hook?.filePath,
        pageId: pageContext?.pageId,
        urlPathname: pageContext?.urlPathname,
      },
    },
  }
}
