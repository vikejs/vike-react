export { clientOnly }

import React, { lazy, Suspense, type ComponentProps, type ComponentType, type ReactNode } from 'react'
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

  const LazyComponent = lazy(() =>
    load().then((mod) => ({
      default: 'default' in mod ? mod.default : mod,
    })),
  )

  const ClientOnly = (props: ComponentProps<T> & { fallback?: ReactNode }) => {
    const { fallback, ...rest } = props
    return (
      <Suspense fallback={<>{fallback}</>}>
        <LazyComponent {...(rest as any)} />
      </Suspense>
    )
  }

  ClientOnly.displayName = 'ClientOnly'

  globalObject.components.set(load, ClientOnly)

  return ClientOnly
}
