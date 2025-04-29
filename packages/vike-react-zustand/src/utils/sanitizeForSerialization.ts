export { sanitizeForSerialization }

/**
 * Sanitizes data for serialization by removing functions, promises, and undefined values.
 * Creates a deep copy of the input with all non-serializable values removed.
 */
function sanitizeForSerialization<T>(input: T, visited = new WeakSet<object>()): T | undefined {
  if (typeof input !== 'object' || input === null) {
    return input
  }
  if (visited.has(input)) {
    return input
  }
  visited.add(input)
  if (Array.isArray(input)) {
    const output = []
    for (const value of input) {
      if (include(value)) {
        const ret = sanitizeForSerialization(value, visited)
        if (include(ret)) {
          output.push(ret)
        } else {
          // Skip the whole array, we can't skip one in the middle of an ordered array
          return undefined
        }
      } else {
        return undefined
      }
    }
    return output as T
  }
  if (input instanceof Map) {
    const output = new Map()
    for (const [key, value] of input.entries()) {
      if (include(value)) {
        const ret = sanitizeForSerialization(value, visited)
        if (include(ret)) {
          output.set(key, ret)
        }
      }
    }
    return output as T
  }
  if (input instanceof Set) {
    const output = new Set()
    for (const value of input.values()) {
      if (include(value)) {
        const ret = sanitizeForSerialization(value, visited)
        if (include(ret)) {
          output.add(ret)
        }
      }
    }
    return output as T
  }
  const output: { [key: string]: any } = {}
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      const value = input[key]
      if (include(value)) {
        const ret = sanitizeForSerialization(value, visited)
        if (include(ret)) {
          output[key] = ret
        }
      }
    }
  }
  return output as T
}
/**
 * Determines if a value should be included in the sanitized output.
 * Excludes functions, promises, undefined, and empty objects/collections.
 */
function include(value: unknown): boolean {
  if (isPromiseLike(value) || typeof value === 'function' || value === undefined) {
    return false
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size > 0
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length > 0
  }

  return true
}

/**
 * Checks if a value is promise-like (has then and catch methods).
 */
function isPromiseLike(value: unknown): boolean {
  return Boolean(
    value &&
      typeof value === 'object' &&
      typeof (value as any).then === 'function' &&
      typeof (value as any).catch === 'function',
  )
}
