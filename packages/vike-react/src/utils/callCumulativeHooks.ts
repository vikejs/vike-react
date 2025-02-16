export { callCumulativeHooks }

import { providePageContext } from 'vike/getPageContext'
import { isCallable } from './isCallable.js'

async function callCumulativeHooks<T>(
  values: undefined | T[],
  pageContext: Record<string, any>,
): Promise<(undefined | null | Exclude<T, Function>)[]> {
  if (!values) return []
  const valuesPromises = values.map((val) => {
    if (isCallable(val)) {
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
