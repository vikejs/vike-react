export { ClientOnly }

import React, { ComponentType, ReactNode, Suspense, lazy, useEffect, useState } from 'react'

type ClientOnlyProps<T> = {
  component: () => Promise<{ default: React.ComponentType<T> }>
  componentRenderer: (Component: React.ComponentType<T>) => ReactNode
  fallback: ReactNode
}

function ClientOnly<T>({ component, componentRenderer, fallback }: ClientOnlyProps<T>) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null)

  useEffect(() => {
    const loadComponent = () => {
      const Component = lazy(() =>
        component()
          .then((LoadedComponent) => {
            return { default: () => componentRenderer(LoadedComponent.default) }
          })
          .catch((error) => {
            console.error('Component loading failed:', error)
            return { default: () => <p>Error loading component</p> }
          })
      )
      setComponent(Component)
    }

    loadComponent()
  }, [component, componentRenderer])

  return <Suspense fallback={fallback}>{Component ? <Component /> : null}</Suspense>
}
