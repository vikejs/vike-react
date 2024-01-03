export { withPageContext }

import { PageContext } from 'vike/types'
import { StateCreator, StoreMutatorIdentifier } from 'zustand'
import { getPageContext } from './renderer/context.js'
import { assert } from './utils.js'

type WithPageContext = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  f: (pageContext: PageContext) => StateCreator<T, Mps, Mcs>
) => StateCreator<T, Mps, Mcs>

type WithPageContextImpl = <T>(f: (pageContext: PageContext) => StateCreator<T, [], []>) => StateCreator<T, [], []>

const withPageContextImpl: WithPageContextImpl = (fn) => (set, get, store) => {
  const pageContext = getPageContext()
  assert(pageContext)
  return fn(pageContext)(set, get, store)
}

const withPageContext = withPageContextImpl as unknown as WithPageContext
