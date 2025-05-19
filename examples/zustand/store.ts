export { useStore }

import { create, withPageContext } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'

interface Store {
  counter: number
  setCounter: (value: number) => void
  nodeVersion: string
}

const useStore = create<Store>()(
  withPageContext((pageContext) =>
    immer((set, get) => ({
      setCounter(value) {
        set((state) => {
          state.counter = value
        })
      },
      counter: Math.floor(10000 * Math.random()),
      nodeVersion: import.meta.env.SSR ? process.version : '',
    })),
  ),
)
