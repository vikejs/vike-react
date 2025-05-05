import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState = { value: 0 }
const countSlice = createSlice({
  name: 'count',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    initializeCount: (state, action: PayloadAction<number>) => {
      if (state.value !== 0) return
      state.value = action.payload
    },
  },
  selectors: {
    selectCount: (counter) => counter.value,
  },
})

export const counterReducer = countSlice.reducer
export const { selectCount } = countSlice.selectors
export const { increment, decrement, initializeCount } = countSlice.actions
