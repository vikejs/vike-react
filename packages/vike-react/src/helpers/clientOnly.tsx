export { clientOnly }

import React, {
  Suspense,
  forwardRef,
  lazy,
  useEffect,
  useState,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
} from 'react'

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
  } else {
    const Component = lazy(() =>
      load()
        .then((LoadedComponent) => ('default' in LoadedComponent ? LoadedComponent : { default: LoadedComponent }))
        .catch((error) => {
          console.error('Component loading failed:', error)
          return { default: (() => <p>Error loading component.</p>) as any }
        }),
    )

    return forwardRef((props, ref) => {
      const [mounted, setMounted] = useState(false)
      useEffect(() => {
        setMounted(true)
      }, [])
      if (!mounted) {
        return <>{props.fallback}</>
      }
      const { fallback, ...rest } = props
      return (
        <Suspense fallback={<>{props.fallback}</>}>
          {/* @ts-ignore */}
          <Component {...rest} ref={ref} />
        </Suspense>
      )
    }) as ComponentType<ComponentProps<T> & { fallback?: ReactNode }>
  }
}
