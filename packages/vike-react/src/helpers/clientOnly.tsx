export { clientOnly }

import React, {
  Suspense,
  forwardRef,
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

    return forwardRef((props, ref) => {
      const [mounted, setMounted] = useState(false)
      const [Component, setComp] = useState<T>()
      useEffect(() => {
    load()
        .then((LoadedComponent) => {
          const p = ('default' in LoadedComponent ? LoadedComponent : { default: LoadedComponent })
      setComp(p.default)
        })
        .catch((error) => {
          console.error('Component loading failed:', error)
          return { default: (() => <p>Error loading component.</p>) as any }
        })
        setMounted(true)
      }, [])
      console.log('Component', Component)
      if (!mounted || !Component) {
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
