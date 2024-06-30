export function isNotFalse<T>(val: T | false): val is T {
  return val !== false
}
