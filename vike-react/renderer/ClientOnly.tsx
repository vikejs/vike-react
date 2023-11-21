export { ClientOnly }

import React, { ComponentType } from 'react'
import { ReactNode, Suspense, lazy, useEffect, useState } from 'react'

type ClientOnlyProps<T extends {}> = {
  component: () => Promise<{ default: React.ComponentType<T> }>
  componentProps: T
  fallback: ReactNode
}

function ClientOnly<T extends {}>({ component, componentProps, fallback }: ClientOnlyProps<T>) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null)

  useEffect(() => {
    const loadComponent = () => {
      const Component = lazy(() =>
        component()
          .then((LoadedComponent) => {
            return { default: () => <LoadedComponent.default {...componentProps} /> }
          })
          .catch((error) => {
            console.error('Component loading failed:', error)
            return { default: () => <p>Error loading component</p> }
          })
      )
      setComponent(Component)
    }

    loadComponent()
  }, [component])

  return <Suspense fallback={fallback}>{Component ? <Component /> : null}</Suspense>
}
