export { ClientOnly }
export { clientOnly }

import React, { lazy, useEffect, useState, startTransition, Suspense } from 'react'
import type { ComponentProps, ComponentType, ReactNode } from 'react'

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

  return Component ? <Component /> : fallback
}

//@ts-expect-error
import.meta.env ??= { SSR: true }

function clientOnly<T extends ComponentType<any>>(load: () => Promise<{ default: T }>) {
  if (import.meta.env.SSR) {
    return (props: ComponentProps<T> & { fallback?: JSX.Element }) => props.fallback
  }

  const Component = lazy(load)

  return (props: ComponentProps<T> & { fallback?: JSX.Element }) => {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    if (!mounted) {
      return props.fallback
    }

    const { fallback, ...rest } = props
    return (
      <Suspense fallback={props.fallback}>
        {
          //@ts-ignore
          <Component {...rest} />
        }
      </Suspense>
    )
  }
}
