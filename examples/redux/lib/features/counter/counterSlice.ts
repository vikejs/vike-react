import { createSlice } from '@reduxjs/toolkit'

export interface CounterSliceState {
  value: number
}

const initialState: CounterSliceState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
  },
  selectors: {
    selectCount: (counter) => counter.value,
  },
})

export const { selectCount } = counterSlice.selectors

export const { increment, decrement } = counterSlice.actions

export default counterSlice.reducer
