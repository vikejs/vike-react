export { useStore }

import { create, withPageContext, transfer, initialize } from 'vike-react-zustand-experimental'
import { immer } from 'zustand/middleware/immer'

interface Store {
  counter: number
  setCounter: (value: number) => void
  nodeVersion: string
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
      ...transfer(async () => {
        return {
          counter: await new Promise((r) => setTimeout(r, 50)).then(() => Math.floor(10000 * Math.random())),
          nodeVersion: process.version,
        }
      }),

      // the function passed to initialize runs on both client/server right after the store is created
      // the return value is merged into the store
      ...initialize(async () => {
        console.log('initialize', get())
      }),
    })),
  ),
)
