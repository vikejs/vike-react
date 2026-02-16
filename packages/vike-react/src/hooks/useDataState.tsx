export { useDataState }

import { type Dispatch, type SetStateAction, useState } from 'react'
import { usePageContext } from './usePageContext.js'

/**
 * Access `pageContext.data` from any React component, and create a state with `pageContext.data` as initial data.
 *
 * See
 * - https://vike.dev/data
 * - https://vike.dev/pageContext-anywhere
 */
function useDataState<Data>(): [Data, Dispatch<SetStateAction<Data>>] {
  const pageContext = usePageContext() as any;
  const [data, setData] = useState(pageContext?.data);
  return [data, setData];
}
