import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Todo = {
  text: string
  isCompleted?: boolean
}

const initialState: { todos: Todo[] } = {
  todos: [],
}

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({ text: action.payload, isCompleted: false })
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.todos[action.payload]
      if (todo) {
        todo.isCompleted = !todo.isCompleted
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.todos.splice(action.payload, 1)
    },
    initializeTodos: (state, action: PayloadAction<Todo[]>) => {
      state.todos = action.payload
    },
  },
  selectors: {
    selectTodos: (todos) => todos.todos,
  },
})

export const todosReducer = todosSlice.reducer
export const { selectTodos } = todosSlice.selectors
export const { addTodo, toggleTodo, deleteTodo, initializeTodos } = todosSlice.actions
