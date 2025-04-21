export { removeFunctionsAndUndefined }

function removeFunctionsAndUndefined(input: any, visited = new WeakSet()): any {
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
        const ret = removeFunctionsAndUndefined(value, visited)
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
    return output
  }
  if (input instanceof Map) {
    const output = new Map()
    for (const [key, value] of input.entries()) {
      if (include(value)) {
        const ret = removeFunctionsAndUndefined(value, visited)
        if (include(ret)) {
          output.set(key, ret)
        }
      }
    }
    return output
  }
  if (input instanceof Set) {
    const output = new Set()
    for (const value of input.values()) {
      if (include(value)) {
        const ret = removeFunctionsAndUndefined(value, visited)
        if (include(ret)) {
          output.add(ret)
        }
      }
    }
    return output
  }
  const output: { [key: string]: any } = {}
  for (const key in input) {
    if (Object.prototype.hasOwnProperty.call(input, key)) {
      const value = input[key]
      if (include(value)) {
        const ret = removeFunctionsAndUndefined(value, visited)
        if (include(ret)) {
          output[key] = ret
        }
      }
    }
  }
  return output
}
function include(value: unknown) {
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

function isPromiseLike(value: any) {
  return value && typeof value === 'object' && typeof value.then === 'function' && typeof value.catch === 'function'
}
