export { withPageContext }

import type { PageContext } from 'vike/types'
import type { StateCreator, StoreMutatorIdentifier } from 'zustand'
import { getPageContext } from './context.js'
import { assert } from './utils/assert.js'

type WithPageContext = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
>(
  f: (pageContext: PageContext) => StateCreator<T, Mps, Mcs>,
) => StateCreator<T, Mps, Mcs>

/**
 * Middleware to make `pageContext` available to the store during initialization.
 *
 * Example usage:
 *
 * ```ts
 * interface Store {
 *   user: {
 *     id: number
 *     firstName: string
 *   }
 * }
 *
 * const useStore = create<Store>()(
 *   withPageContext((pageContext) => (set, get, store) => ({
 *     user: pageContext.user
 *   }))
 * )
 * ```
 *
 * https://github.com/vikejs/vike-react/tree/main/packages/vike-react-zustand
 */
const withPageContext: WithPageContext = (fn) => (set, get, store) => {
  const pageContext = getPageContext()
  assert(pageContext)
  return fn(pageContext)(set, get, store)
}
