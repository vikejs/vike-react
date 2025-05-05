import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Todo = { text: string }
const initialState = { todoList: [] as Todo[] }

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todoList.push({ text: action.payload })
    },
    initializeTodos: (state, action: PayloadAction<Todo[]>) => {
      if (state.todoList.length > 0) return
      state.todoList = action.payload
    },
  },
  selectors: {
    selectTodos: (state) => state.todoList,
  },
})

export const todosReducer = todosSlice.reducer
export const { selectTodos } = todosSlice.selectors
export const { addTodo, initializeTodos } = todosSlice.actions
