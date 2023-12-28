export { useStore }

import { createUseStore, server } from 'vike-react-zustand'
import { PageContext } from 'vike/types'
import { create } from 'zustand'

interface Store {
  counter: number
  setCounter: (value: number) => void
  serverEnv: string
}

const useStore = createUseStore((pageContext: PageContext) =>
  create<Store>()((set, get) => ({
    counter: Math.floor(10000 * Math.random()),
    setCounter(value) {
      set({ counter: value })
    },

    // the callback only runs on the server,
    // the return value is passed to the client on the initial navigation
    ...server(() => ({
      serverEnv: process.env.SOME_ENV!
    }))
  }))
)
