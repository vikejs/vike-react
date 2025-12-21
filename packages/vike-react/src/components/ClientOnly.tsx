export { ClientOnly }

import React, { useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { usePageContext } from '../hooks/usePageContext.js'
import { assert } from '../utils/assert.js'

/**
 * Render children only on the client-side.
 *
 * Strips the children prop on server-side to remove
 * the component from the server bundle.
 *
 * https://vike.dev/ClientOnly
 */
function ClientOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const pageContext = usePageContext()
  if (!pageContext.isClientSide) assert(children === undefined)
  const hydrated = useHydrated()
  return <>{hydrated ? children : fallback}</>
}

// Copied from https://github.com/sergiodxa/remix-utils/blob/33e6b04a08ef5f9b65e89c0a280c12b83762ef66/src/react/use-hydrated.ts#L17
/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 *
 * Example: Disable a button that needs JS to work.
 * ```tsx
 * let hydrated = useHydrated();
 * return (
 *   <button type="button" disabled={!hydrated} onClick={doSomethingCustom}>
 *     Click me
 *   </button>
 * );
 * ```
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

function subscribe() {
  return () => {}
}
