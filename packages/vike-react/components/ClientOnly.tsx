export { ClientOnly }

import React, { Suspense, lazy, useEffect, useState, startTransition } from 'react'
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

  return <Suspense fallback={fallback}>{Component ? <Component /> : fallback}</Suspense>
}
