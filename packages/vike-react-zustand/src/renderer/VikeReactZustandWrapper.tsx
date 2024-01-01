import React, { ReactNode, useMemo } from 'react'
import type { PageContext } from 'vike/types'
import { getContext, getCreateStore } from './context.js'
import { assert } from '../utils.js'

type VikeReactZustandWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactZustandWrapper({ pageContext, children }: VikeReactZustandWrapperProps) {
  const context = getContext()
  assert(context)
  const createStore = getCreateStore()
  const store = useMemo(() => createStore?.(pageContext), [createStore])
  if (!store) {
    // Is that the best thing to do?
    return children
    /* This is problematic if the user first goes to a page that doesn't use any store and then navigates to a page that uses a store.
    throw new Error('Call createUseStore() ')
    */
  }

  // Trick to make import.meta.env.SSR work direclty on Node.js (without Vite)
  // @ts-ignore
  import.meta.env ??= { SSR: true }
  if (import.meta.env.SSR) {
    pageContext._vikeReactZustand = removeFunctionsAndUndefined(store.getState())
  } else if (!store.__hydrated__) {
    store.__hydrated__ = true
    store.setState(pageContext._vikeReactZustand)
  }

  return <context.Provider value={store}>{children}</context.Provider>
}

const removeFunctionsAndUndefined = (object: any) => {
  const output: any = {}
  Object.keys(object).forEach((key) => {
    if (object[key] !== undefined && typeof object[key] !== 'function') {
      if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
        const value = removeFunctionsAndUndefined(object[key])
        if (value && Object.keys(value).length > 0) {
          output[key] = value
        }
      } else {
        output[key] = object[key]
      }
    }
  })

  return output
}
