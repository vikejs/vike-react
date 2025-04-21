export function getGlobalObject<T extends Record<string, unknown> = never>(
  // We use the filename as key; each `getGlobalObject()` call should live in a unique filename.
  key: `${string}.ts`,
  defaultValue: T,
): T {
  const allGlobalObjects = (globalThis.__vike_react_zustand_experimental =
    globalThis.__vike_react_zustand_experimental || {})
  const globalObject = (allGlobalObjects[key] = (allGlobalObjects[key] as T) || defaultValue)
  return globalObject
}
declare global {
  var __vike_react_zustand_experimental: undefined | Record<string, Record<string, unknown>>
}
