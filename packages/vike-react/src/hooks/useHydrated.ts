export { useHydrated }

import { useSyncExternalStore } from 'react'

// Copied from https://github.com/sergiodxa/remix-utils/blob/33e6b04a08ef5f9b65e89c0a280c12b83762ef66/src/react/use-hydrated.ts
/**
 * Whether the page has already been hydrated.
 *
 * On the server, it always returns `false`. On the client, it returns `false` on first render and `true` after hydration completes.
 *
 * https://vike.dev/useHydrated
 *
 * Example: Disable a button that needs JavaScript to work.
 * ```tsx
 * const hydrated = useHydrated()
 * return (
 *   <button type="button" disabled={!hydrated} onClick={doSomething}>
 *     Click me
 *   </button>
 * );
 * ```
 */
function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeDummy,
    () => true,
    () => false,
  )
}

function subscribeDummy() {
  return () => {}
}
