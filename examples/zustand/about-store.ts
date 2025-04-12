export { useStore }

import { transfer, create, withPageContext } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'

interface Store {
  counter: number
  setCounter: (value: number) => void
  nodeVersionAbout: string
}

const useStore = create<Store>()(
  // the devtools middleware is included by default
  withPageContext((pageContext) =>
    immer((set, get) => ({
      setCounter(value) {
        set((state) => {
          state.counter = value
        })
      },

      // the function passed to transfer only runs on the server
      // the return value is available on client/server
      ...transfer(() => ({
        counter: Math.floor(10000 * Math.random()),
        nodeVersionAbout: process.version,
      })),
    })),
  ),
)
