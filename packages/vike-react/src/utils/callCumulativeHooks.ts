export async function callCumulativeHooks(values: undefined | unknown[], pageContext: unknown): Promise<unknown[]> {
  if (!values) return []
  const valuesPromises = values.map((val) => {
    if (typeof val === 'function') {
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
