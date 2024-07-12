/**
 * ```js
 * Object.entries(obj).forEach(([key, val]) => { doSomething() })
 * // Same but with type inference
 * forEach(obj, (key, val) => { doSomething() })
 * ```
*/
export function forEach<Obj extends object>(
  obj: Obj,
  iterator: <Key extends keyof Obj>(key: Key, val: Obj[Key]) => void
): void {
  Object.entries(obj).forEach(([key, val]) => iterator(key as keyof Obj, val))
}
