export { useStore }

import { create, serverOnly, withPageContext } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'

interface Store {
  counter: number
  setCounter: (value: number) => void
  serverEnv: string
}

// withPageContext is optional
const useStore = withPageContext((pageContext) =>
  // the devtools middleware is included by default
  create<Store>()(
    immer((set, get) => ({
      counter: Math.floor(10000 * Math.random()),
      setCounter(value) {
        set((state) => {
          state.counter = value
        })
      },

      // the function passed to serverOnly only runs on the server
      // the return value is available on client/server
      ...serverOnly(() => ({
        serverEnv: process.env.SOME_ENV!
      }))
    }))
  )
)
