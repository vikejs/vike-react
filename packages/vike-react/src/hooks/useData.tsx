export { useData }

import { usePageContext } from './usePageContext.js'

/**
 * Access `pageContext.data` from any React component.
 *
 * https://vike.dev/useData
 */
function useData<Data>(): Data {
  const data = usePageContext()?.data
  return data as any
}
