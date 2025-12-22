export { useHydrated }

import { useSyncExternalStore } from 'react'

// Copied from https://github.com/sergiodxa/remix-utils/blob/33e6b04a08ef5f9b65e89c0a280c12b83762ef66/src/react/use-hydrated.ts
/**
 * Return a boolean indicating if the JS has been hydrated already.
 * When doing Server-Side Rendering, the result will always be false.
 * When doing Client-Side Rendering, the result will always be false on the
 * first render and true from then on. Even if a new component renders it will
 * always start with true.
 *
 * Example: Disable a button that needs JS to work.
 * ```tsx
 * const hydrated = useHydrated()
 * return (
 *   <button type="button" disabled={!hydrated} onClick={doSomethingCustom}>
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
