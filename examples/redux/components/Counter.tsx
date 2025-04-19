import React from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { increment, selectCount } from '../lib/features/counter/counterSlice'

export function Counter() {
  const dispatch = useAppDispatch()
  const count = useAppSelector(selectCount)

  return (
    <button type="button" onClick={() => dispatch(increment())}>
      Counter {count}
    </button>
  )
}
