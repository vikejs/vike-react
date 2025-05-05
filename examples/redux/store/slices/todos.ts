import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Todo = { text: string }
const initialState = { todos: [] as Todo[] }

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({ text: action.payload })
    },
    initializeTodos: (state, action: PayloadAction<Todo[]>) => {
      if (state.todos.length > 0) return
      state.todos = action.payload
    },
  },
  selectors: {
    selectTodos: (state) => state.todos,
  },
})

export const todosReducer = todosSlice.reducer
export const { selectTodos } = todosSlice.selectors
export const { addTodo, initializeTodos } = todosSlice.actions
