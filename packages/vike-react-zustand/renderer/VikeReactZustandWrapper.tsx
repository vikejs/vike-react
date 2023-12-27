import React, { ReactNode, useMemo } from 'react'
import type { PageContext } from 'vike/types'
import { getContext, getCreateStore } from './context.js'
import { StreamedHydration } from './StreamedHydration.js'

type VikeReactZustandWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactZustandWrapper({ pageContext, children }: VikeReactZustandWrapperProps) {
  const context = getContext()
  const createStore = getCreateStore()
  const store = useMemo(() => createStore?.(pageContext), [createStore])
  if (!store) {
    return children
  }

  return (
    <context.Provider value={store}>
      <StreamedHydration store={store}>{children}</StreamedHydration>
    </context.Provider>
  )
}
