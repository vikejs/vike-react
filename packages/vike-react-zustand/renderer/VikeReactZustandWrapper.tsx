import React, { ReactNode, useState } from 'react'
import type { PageContext } from 'vike/types'
import { getContext, getCreateStore } from './ZustandServerSide.js'

type VikeReactZustandWrapperProps = {
  pageContext: PageContext
  children: ReactNode
}

export default function VikeReactZustandWrapper({ pageContext, children }: VikeReactZustandWrapperProps) {
  const zustandContext = getContext()
  const createStore = getCreateStore()
  const [store] = useState(() => createStore(pageContext))

  return <zustandContext.Provider value={store}>{children}</zustandContext.Provider>
}
