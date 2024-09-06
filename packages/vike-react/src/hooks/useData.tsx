export { useData }

import { usePageContext } from './usePageContext.js'

function useData<Data>(): Data {
  const data = usePageContext()?.data
  return data as any
}
