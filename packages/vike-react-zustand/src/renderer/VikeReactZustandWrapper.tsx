import React, { ReactNode, useMemo } from 'react'
import type { PageContext } from 'vike/types'
import { getReactStoreContext, initializers_get, setPageContext } from './context.js'
import { assert, removeFunctionsAndUndefined } from '../utils.js'
import { create as createZustand } from 'zustand'
import { devtools } from 'zustand/middleware'
import { cloneDeep, mergeWith } from 'lodash-es'

// Trick to make import.meta.env.SSR work direclty on Node.js (without Vite)
// @ts-expect-error
import.meta.env ??= { SSR: true }

type VikeReactZustandWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactZustandWrapper({ pageContext, children }: VikeReactZustandWrapperProps) {
  const initializers = initializers_get()
  const stores = useMemo(
    () =>
      Object.entries(initializers).map(([key, initializer]) => {
        setPageContext(pageContext)
        const store = create(initializer)
        setPageContext(null)
        return [key, store] as const
      }),
    [initializers]
  )

  if (!stores.length) {
    return children
  }

  const reactStoreContext = getReactStoreContext()
  assert(reactStoreContext)

  for (const [key, store] of stores) {
    if (import.meta.env.SSR) {
      pageContext._vikeReactZustand ??= {}
      pageContext._vikeReactZustand = {
        ...pageContext._vikeReactZustand,
        [key]: removeFunctionsAndUndefined(store.getState())
      }
      // pageContext._vikeReactZustand can be undefined if ssr is disabled
    } else if (pageContext._vikeReactZustand && !store.__hydrated__ && !pageContext.isClientSideNavigation) {
      assert(key in pageContext._vikeReactZustand)

      // TODO: remove lodash-es dependency and implement deep merging
      const merged = mergeWith(cloneDeep(store.getState()), pageContext._vikeReactZustand[key])
      store.setState(merged, true)
      store.__hydrated__ = true
    }
  }

  return <reactStoreContext.Provider value={Object.fromEntries(stores)}>{children}</reactStoreContext.Provider>
}

function create(initializer: any) {
  return createZustand()(devtools(initializer))
}
