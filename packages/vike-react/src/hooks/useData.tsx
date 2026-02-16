export { useData }

import { usePageContext } from './usePageContext.js'

/**
 * Access `pageContext.data` from any React component.
 *
 * See
 * - https://vike.dev/data
 * - https://vike.dev/pageContext-anywhere
 */
function useData<Data>(): Data {
  const data = usePageContext()?.data
  return data as any
}
