export { ClientOnly }

import React, { ComponentType, ReactNode, Suspense, lazy, useEffect, useState } from 'react'

function ClientOnly<T>({
  load,
  children,
  fallback
}: {
  load: () => Promise<{ default: React.ComponentType<T> }>
  children: (Component: React.ComponentType<T>) => ReactNode
  fallback: ReactNode
}) {
  const [Component, setComponent] = useState<ComponentType<unknown> | null>(null)

  useEffect(() => {
    const loadComponent = () => {
      const Component = lazy(() =>
        load()
          .then((LoadedComponent) => {
            return { default: () => children(LoadedComponent.default) }
          })
          .catch((error) => {
            console.error('Component loading failed:', error)
            return { default: () => <p>Error loading component.</p> }
          })
      )
      setComponent(Component)
    }

    loadComponent()
  }, [load, children])

  return <Suspense fallback={fallback}>{Component ? <Component /> : null}</Suspense>
}
