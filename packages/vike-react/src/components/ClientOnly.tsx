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
