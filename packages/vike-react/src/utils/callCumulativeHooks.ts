export { callCumulativeHooks }

import { providePageContext } from 'vike/getPageContext'
import { isCallable } from './isCallable.js'
import type { PageContext } from 'vike/types'

async function callCumulativeHooks<T>(
  values: undefined | T[],
  pageContext: PageContext,
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
