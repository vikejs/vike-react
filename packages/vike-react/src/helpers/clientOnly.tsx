export { clientOnly }

import React, {
  forwardRef,
  useLayoutEffect,
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
      const [LoadedComponent, setLoadedComponent] = useState<React.ComponentType<any> | null>(null)

      useLayoutEffect(() => {
        ;(async () => {
          try {
            const Component = await load()
            const LoadedComponent = 'default' in Component ? Component.default : Component
            setLoadedComponent(() => LoadedComponent)
          } catch (error) {
            setLoadedComponent(() => ErrorComponent)
          }
        })()
      }, [])

      const { fallback, ...rest } = props
      return (
        <>
          {!LoadedComponent && <>{props.fallback}</>}
          {LoadedComponent && <LoadedComponent {...rest} ref={ref} />}
        </>
      )
    }) as ComponentType<ComponentProps<T> & { fallback?: ReactNode }>
  }
}

function ErrorComponent() {
  return <p>Error loading component.</p>
}
