export { clientOnly }

import React, {
  forwardRef,
  useEffect,
  useState,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
} from 'react'
import { getGlobalObject } from '../utils/getGlobalObject.js'

const globalObject = getGlobalObject('ClientOnly.tsx', {
  components: new WeakMap<any, any>()
})

function clientOnly<T extends ComponentType<any>>(
  load: () => Promise<{ default: T } | T>,
): ComponentType<ComponentProps<T> & { fallback?: ReactNode }> {
  if (!globalThis.__VIKE__IS_CLIENT) {
    return (props) => <>{props.fallback}</>
  }

  const ClientOnly = forwardRef<InstanceType<T>, ComponentProps<T> & { fallback?: ReactNode }>(
    (props, ref) => {
      const { fallback, ...rest } = props
      const [Component, setComponent] = useState<T | null>(null)

      useEffect(() => {
        let cancelled = false

        if (globalObject.components.has(load)) {
          setComponent(globalObject.components.get(load))
          return
        }

        load()
          .then((mod) => {
            const C = 'default' in mod ? mod.default : mod
            if (!cancelled) {
              globalObject.components.set(load, C)
              setComponent(() => C)
            }
          })
          .catch((err) => console.error('Component loading failed:', err))

        return () => {
          cancelled = true
        }
      }, [])

      if (!Component) {
        return <>{fallback}</>
      }

      return <Component {...(rest as any)} ref={ref} />
    },
  )

  ClientOnly.displayName = 'ClientOnly'
  return ClientOnly
}

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

