export { useStore }

import { create, serverOnly, withPageContext } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'

interface Store {
  counter: number
  setCounter: (value: number) => void
  serverEnv: string
  url: string
}

const useStore = withPageContext((pageContext) =>
  create<Store>()(
    immer((set, get) => ({
      counter: Math.floor(10000 * Math.random()),
      setCounter(value) {
        set((state) => {
          state.counter = value
        })
      },

      // the callback only runs on the server,
      // the return value is passed to the client on the initial navigation
      ...serverOnly(() => ({
        url: pageContext.urlOriginal,
        serverEnv: process.env.SOME_ENV!
      }))
    }))
  )
)

// This works, too
// const useStore = create<Store>()((set, get) => ({
//   counter: Math.floor(10000 * Math.random()),
//   setCounter(value) {
//     set({ counter: value })
//   },

//   // the callback only runs on the server,
//   // the return value is passed to the client on the initial navigation
//   ...server(() => ({
//     serverEnv: process.env.SOME_ENV!
//   }))
// }))
