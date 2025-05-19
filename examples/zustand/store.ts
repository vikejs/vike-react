export { useNodeStore }
export { useCounterStore }
export { useTodoStore }

import { create, withPageContext } from 'vike-react-zustand'
import { immer } from 'zustand/middleware/immer'
import type { Data } from './pages/index/+data'

interface CounterStore {
  counter: number
  setCounter: (value: number) => void
}
const useCounterStore = create<CounterStore>()(
  immer((set, get) => ({
    setCounter(value) {
      set((state) => {
        state.counter = value
      })
    },
    counter: Math.floor(10000 * Math.random()),
  })),
)

type Todo = { text: string }
interface TodoStore {
  todoItems: Todo[]
  addTodo: (todo: Todo) => void
}
const useTodoStore = create<TodoStore>()(
  // TODO/now
  // withPageContext((pageContext: PageContext & { data: Data }) =>
  withPageContext((pageContext) =>
    immer((set, get) => ({
      todoItems: (pageContext.data as Data).todosInit,
      addTodo(todo) {
        set((state) => {
          state.todoItems.push(todo)
        })
      },
    })),
  ),
)

// Using a store to pass information form server-side to client-side
const useNodeStore = create<{ nodeVersion: string }>()(() => ({
  nodeVersion: import.meta.env.SSR ? process.version : '',
}))
