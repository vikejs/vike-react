/** Same as array.includes(element) but with better type */
export function includes<T>(array: readonly T[], element: unknown): element is T {
  return array.includes(element as any)
}
