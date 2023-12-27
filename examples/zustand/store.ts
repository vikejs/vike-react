export { useStore }

import { createUseStore, createServerState } from 'vike-react-zustand'
import { PageContext } from 'vike/types'
import { create } from 'zustand'

interface Store {
  counter: number
  setCounter: (value: number) => void

  serverEnv: string
}

const serverState = createServerState(() => ({
  serverEnv: process.env.SOME_ENV!
}))

const useStore = createUseStore((pageContext: PageContext) =>
  create<Store>()((set, get) => ({
    counter: 0,
    setCounter(value) {
      set({ counter: value })
    },
    ...serverState
  }))
)
