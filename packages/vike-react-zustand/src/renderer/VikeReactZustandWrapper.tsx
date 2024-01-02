import React, { ReactNode, useMemo } from 'react'
import type { PageContext } from 'vike/types'
import { getReactStoreContext, initializer_get, withPageContextCallback_get } from './context.js'
import { assert, removeFunctionsAndUndefined } from '../utils.js'
import { callCreateOriginal } from '../index.js'

type VikeReactZustandWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactZustandWrapper({ pageContext, children }: VikeReactZustandWrapperProps) {
  const withPageContextCallback = withPageContextCallback_get()
  withPageContextCallback?.(pageContext)

  // Needs to be called after `withPageContextCallback?.(pageContext)`
  const initializer = initializer_get()
  const store = initializer && useMemo(() => callCreateOriginal(initializer), [initializer])

  if (!store) {
    return children
  }

  const reactStoreContext = getReactStoreContext()
  assert(reactStoreContext)

  // Trick to make import.meta.env.SSR work direclty on Node.js (without Vite)
  // @ts-ignore
  import.meta.env ??= { SSR: true }
  if (import.meta.env.SSR) {
    pageContext._vikeReactZustand = removeFunctionsAndUndefined(store.getState())
  } else if (!store.__hydrated__) {
    store.__hydrated__ = true
    store.setState(pageContext._vikeReactZustand)
  }

  return <reactStoreContext.Provider value={store}>{children}</reactStoreContext.Provider>
}
