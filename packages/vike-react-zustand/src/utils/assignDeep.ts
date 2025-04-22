export { assignDeep }

function assignDeep(initial: Record<keyof any, any>, override: Record<keyof any, any>) {
  if (!initial || !override) {
    return initial ?? override ?? {}
  }
  for (const key of Object.keys(override)) {
    initial[key] =
      isPlainObject(initial[key]) && isPlainObject(override[key])
        ? assignDeep(initial[key], override[key])
        : override[key]
  }
  return initial
}

function isPlainObject(value: any): value is object {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return (
    // Fast path for most common objects.
    prototype === Object.prototype ||
    // Support objects created without a prototype.
    prototype === null ||
    // Support plain objects from other realms.
    Object.getPrototypeOf(prototype) === null
  )
}
