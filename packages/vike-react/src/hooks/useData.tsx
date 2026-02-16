export { useData }

import { usePageContext } from './usePageContext.js'

/**
 * Access `pageContext.data` from any React component, and create a store with `pageContext.data` as initial data.
 *
 * See
 * - https://vike.dev/data
 * - https://vike.dev/pageContext-anywhere
 */
function useData<Data>(): Data {
  const data = usePageContext()?.data
  return data as any
}
