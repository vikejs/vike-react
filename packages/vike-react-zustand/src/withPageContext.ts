export { withPageContext }

import type { PageContext } from 'vike/types'
import type { StateCreator, StoreMutatorIdentifier } from 'zustand'
import { getPageContext } from './renderer/context.js'
import { assert } from './utils.js'

type WithPageContext = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: (pageContext: PageContext) => StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>

/**
 * Middleware to make `pageContext` available to the store.
 *
 * Example usage:
 *
 * ```ts
 *
 * interface Store {
 *   user: {
 *     id: number
 *     firstName: string
 *   }
 * }
 *
 * const useStore = create<Store>()(
 *   withPageContext((pageContext) => (set, get) => ({
 *     user: pageContext.user
 *   }))
 * )
 * ```
 */
const withPageContext: WithPageContext = (fn) => (set, get, store) => {
  const pageContext = getPageContext()
  assert(pageContext)
  return fn(pageContext)(set, get, store)
}
