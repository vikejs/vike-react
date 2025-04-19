export { Counter }

import React from 'react'
import { useStore } from '../../about-store'

function Counter() {
  const { counter, setCounter } = useStore()

  return <button onClick={() => setCounter(counter + 1)}>Counter {counter}</button>
}
