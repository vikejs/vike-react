export { useStore }

import { create, server } from 'vike-react-zustand'

interface Store {
  counter: number
  setCounter: (value: number) => void
  serverEnv: string
}

const useStore = create<Store>(
  (
    set,
    get
  /* TODO
  pageContext
  */
  ) => ({
    counter: Math.floor(10000 * Math.random()),
    setCounter(value) {
      set({ counter: value })
    },

    // the callback only runs on the server,
    // the return value is passed to the client on the initial navigation
    ...server(() => ({
      serverEnv: process.env.SOME_ENV!
    }))
  })
)
