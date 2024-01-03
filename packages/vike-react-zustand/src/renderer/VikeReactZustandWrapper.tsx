import React, { ReactNode, useMemo } from 'react'
import type { PageContext } from 'vike/types'
import { getReactStoreContext, initializers_get, setPageContext } from './context.js'
import { assert, removeFunctionsAndUndefined } from '../utils.js'
import { create as createZustand } from 'zustand'
import { devtools } from 'zustand/middleware'

type VikeReactZustandWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactZustandWrapper({ pageContext, children }: VikeReactZustandWrapperProps) {
  // Needs to be called after `withPageContextCallback?.(pageContext)`
  const initializers = initializers_get()
  const stores = useMemo(() => {
    return Object.fromEntries(
      Object.entries(initializers).map(([key, initializer]) => {
        setPageContext(pageContext)
        const store = create(initializer)
        setPageContext(null)
        return [key, store]
      })
    )
  }, [initializers])

  if (!Object.keys(stores).length) {
    return children
  }

  const reactStoreContext = getReactStoreContext()
  assert(reactStoreContext)

  for (const [key, store] of Object.entries(stores)) {
    // Trick to make import.meta.env.SSR work direclty on Node.js (without Vite)
    // @ts-expect-error
    import.meta.env ??= { SSR: true }
    if (import.meta.env.SSR) {
      pageContext._vikeReactZustand ??= {}
      pageContext._vikeReactZustand = {
        ...pageContext._vikeReactZustand,
        [key]: removeFunctionsAndUndefined(store.getState())
      }
    } else if (!store.__hydrated__) {
      store.__hydrated__ = true
      store.setState(pageContext._vikeReactZustand[key])
    }
  }

  return <reactStoreContext.Provider value={stores}>{children}</reactStoreContext.Provider>
}

function create(initializer: any) {
  return createZustand()(devtools(initializer))
}
