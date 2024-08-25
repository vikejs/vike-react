export { callCumulativeHooks }

import { providePageContext } from 'vike/getPageContext'

async function callCumulativeHooks(
  values: undefined | unknown[],
  pageContext: Record<string, any>,
): Promise<unknown[]> {
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
