export { clientOnly }

import React, { forwardRef, useEffect, useState, type ComponentProps, type ComponentType, type ReactNode } from 'react'
import { getGlobalObject } from '../utils/getGlobalObject.js'

const globalObject = getGlobalObject('ClientOnly.tsx', {
  components: new WeakMap<any, any>(),
})

/**
 * Load and render a component only on the client-side.
 *
 * https://vike.dev/clientOnly
 */
function clientOnly<T extends ComponentType<any>>(
  load: () => Promise<{ default: T } | T>,
): ComponentType<ComponentProps<T> & { fallback?: ReactNode }> {
  if (!globalThis.__VIKE__IS_CLIENT) {
    return (props) => <>{props.fallback}</>
  }

  if (globalObject.components.has(load)) {
    return globalObject.components.get(load)
  }

  const ClientOnly = forwardRef<any, ComponentProps<T> & { fallback?: ReactNode }>((props, ref) => {
    const { fallback, ...rest } = props
    const [Component, setComponent] = useState<T | null>(null)
    const hydrated = useHydrated()

    useEffect(() => {
      let cancelled = false

      load()
        .then((mod) => {
          const C = 'default' in mod ? mod.default : mod
          if (!cancelled) setComponent(() => C)
        })
        .catch((err) => {
          console.error('Component loading failed:', err)
        })

      return () => {
        cancelled = true
      }
    }, [])

    if (!hydrated || !Component) {
      return <>{fallback}</>
    }

    return <Component {...(rest as any)} ref={ref} />
  })

  ClientOnly.displayName = 'ClientOnly'

  globalObject.components.set(load, ClientOnly)

  // @ts-ignore
  return ClientOnly
}

function useHydrated(): boolean {
  return React.useSyncExternalStore(
    subscribeDummy,
    () => true,
    () => false,
  )
}
function subscribeDummy() {
  return () => {}
}
