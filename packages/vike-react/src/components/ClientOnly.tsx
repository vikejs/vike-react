export { ClientOnly }

import React from 'react'
import type { ReactNode } from 'react'
import { usePageContext } from '../hooks/usePageContext.js'
import { useHydrated } from '../hooks/useHydrated.js'
import { assert } from '../utils/assert.js'

/**
 * Render children only on the client-side.
 *
 * Children are completely removed and never loaded on the server.
 *
 * https://vike.dev/ClientOnly
 */
function ClientOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const pageContext = usePageContext()

  // Assert tree-shaking: children should be removed on the server-side
  if (!pageContext.isClientSide) assert(children === undefined)

  const hydrated = useHydrated()

  return <>{hydrated ? children : fallback}</>
}
