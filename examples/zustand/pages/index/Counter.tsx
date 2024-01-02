export { Counter, Counter2 }

import React from 'react'
import { useStore, useStore2 } from '../../store'

function Counter() {
  const { counter, setCounter } = useStore()

  return <button onClick={() => setCounter(counter + 1)}>Counter {counter}</button>
}

function Counter2() {
  const { counter, setCounter } = useStore2()

  return <button onClick={() => setCounter(counter + 1)}>Counter {counter}</button>
}
