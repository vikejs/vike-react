//@ts-nocheck

export { clientOnly }

import React, {
  Suspense,
  forwardRef,
  lazy,
  useEffect,
  useState,
  type ComponentProps,
  type ComponentType,
  type ReactNode
} from 'react'

function clientOnly<T extends ComponentType<any>>(
  load: () => Promise<{ default: T } | T>
): ComponentType<ComponentProps<T> & { fallback?: ReactNode }> {
  // Client side: always bundled by Vite, import.meta.env.SSR === false
  // Server side: may or may note be bundled by Vite, import.meta.env.SSR === true || import.meta.env === undefined
  import.meta.env ??= { SSR: true }
  if (import.meta.env.SSR) return (props) => <>{props.fallback}</>

  const Component = lazy(() =>
    load()
      .then((LoadedComponent) => ('default' in LoadedComponent ? LoadedComponent : { default: LoadedComponent }))
      .catch((error) => {
        console.error('Component loading failed:', error)
        return { default: () => <p>Error loading component.</p> }
      })
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
        <Component {...rest} ref={ref} />
      </Suspense>
    )
  })
}
