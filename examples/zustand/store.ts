export { useNodeStore }
export { useCounterStore }

import { create, withPageContext } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'

interface CounterStore {
  counter: number
  setCounter: (value: number) => void
}
const useCounterStore = create<CounterStore>()(
  withPageContext((pageContext) =>
    immer((set, get) => ({
      setCounter(value) {
        set((state) => {
          state.counter = value
        })
      },
      counter: Math.floor(10000 * Math.random()),
    })),
  ),
)

// Using a store to pass information form server-side to client-side
const useNodeStore = create<{ nodeVersion: string }>()(() => ({
  nodeVersion: import.meta.env.SSR ? process.version : '',
}))
