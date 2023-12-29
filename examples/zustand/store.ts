export { useStore }

import { create, serverOnly, withPageContext } from 'vike-react-zustand'

interface Store {
  counter: number
  setCounter: (value: number) => void
  serverEnv: string
  url: string
}

const useStore = withPageContext((pageContext) =>
  create<Store>()((set, get) => ({
    counter: Math.floor(10000 * Math.random()),
    setCounter(value) {
      set({ counter: value })
    },
    url: pageContext.urlOriginal,

    // the callback only runs on the server,
    // the return value is passed to the client on the initial navigation
    ...serverOnly(() => ({
      serverEnv: process.env.SOME_ENV!
    }))
  }))
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
