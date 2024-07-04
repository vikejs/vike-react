export { ClientOnly }

import React, { lazy, useEffect, useState, startTransition } from 'react'
import type { ComponentType, ReactNode } from 'react'

function ClientOnly<T>({
  load,
  children,
  fallback,
  deps = []
}: {
  load: () => Promise<{ default: React.ComponentType<T> } | React.ComponentType<T>>
  children: (Component: React.ComponentType<T>) => ReactNode
  fallback: ReactNode
  deps?: Parameters<typeof useEffect>[1]
}) {
  // TODO/next-major-release: remove this file/export
  console.warn('[vike-react][warning] <ClientOnly> is deprecated: use clientOnly() instead https://vike.dev/clientOnly')

  const [Component, setComponent] = useState<ComponentType<unknown> | null>(null)

  useEffect(() => {
    const loadComponent = () => {
      const Component = lazy(() =>
        load()
          .then((LoadedComponent) => {
            return {
              default: () => children('default' in LoadedComponent ? LoadedComponent.default : LoadedComponent)
            }
          })
          .catch((error) => {
            console.error('Component loading failed:', error)
            return { default: () => <p>Error loading component.</p> }
          })
      )
      setComponent(Component)
    }

    startTransition(() => {
      loadComponent()
    })
  }, deps)

  return Component ? <Component /> : fallback
}
