export { callCumulativeHooks }

import { providePageContext } from 'vike/getPageContext'
import type { ImportString } from 'vike/types'

async function callCumulativeHooks<T>(
  values: undefined | T[],
  pageContext: Record<string, any>,
): Promise<(undefined | null | Exclude<T, Function | ImportString>)[]> {
  if (!values) return []
  const valuesPromises = values.map((val) => {
    if (typeof val === 'function') {
      providePageContext(pageContext)
      // Hook
      return val(pageContext)
    } else {
      // Plain value
      return val
    }
  })
  const valuesResolved = await Promise.all(valuesPromises)
  return valuesResolved
}
