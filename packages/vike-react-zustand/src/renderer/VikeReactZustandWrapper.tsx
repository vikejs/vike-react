import React, { ReactNode, useMemo } from 'react'
import type { PageContext } from 'vike/types'
import { getContext, getCreateStore } from './context.js'
import { isEqual } from 'lodash-es'
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

  if (typeof window === 'undefined') {
    // diff removes functions
    pageContext.vikeReactZustand = diff(store.getState(), {})
  } else if (!store.__hydrated__) {
    store.__hydrated__ = true
    store.setState(pageContext.vikeReactZustand)
  }

  return <context.Provider value={store}>{children}</context.Provider>
}

const diff = (newState: any, oldState: any) => {
  const output: any = {}
  Object.keys(newState).forEach((key) => {
    if (
      newState[key] !== null &&
      newState[key] !== undefined &&
      typeof newState[key] !== 'function' &&
      !isEqual(newState[key], oldState[key])
    ) {
      if (typeof newState[key] === 'object' && !Array.isArray(newState[key])) {
        const value = diff(newState[key], oldState[key])
        if (value && Object.keys(value).length > 0) {
          output[key] = value
        }
      } else {
        output[key] = newState[key]
      }
    }
  })

  return output
}
