import React, { ReactNode, useMemo } from 'react'
import type { PageContext } from 'vike/types'
import { getContext, getCreateStore } from './context.js'

type VikeReactZustandWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactZustandWrapper({ pageContext, children }: VikeReactZustandWrapperProps) {
  const createStore = getCreateStore()
  const store = useMemo(() => createStore?.(pageContext), [createStore])
  if (!store) {
    return children
  }

  const context = getContext()
  return <context.Provider value={store}>{children}</context.Provider>
}
