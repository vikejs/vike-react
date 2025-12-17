export { clientOnlySimple }

import React, { useSyncExternalStore, type ComponentType, type ReactNode } from 'react'

function clientOnlySimple<P extends object>(Component: ComponentType<P>): ComponentType<P & { fallback?: ReactNode }> {
  return (props) => {
    const hydrated = useHydrated()

    const { fallback, ...rest } = props
    return <>{hydrated ? <Component {...(rest as P)} /> : <>{fallback}</>}</>
  }
}

function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}

function subscribe() {
  return () => {}
}
