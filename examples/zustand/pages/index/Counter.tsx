export { Counter }

import React from 'react'
import { useStore } from '../../store'

function Counter() {
  const { setCounter } = useStore()
  const counter = useStore((s) => s.counter)

  console.log(useStore.getState());
  

  return <button onClick={() => setCounter(counter + 1)}>Counter {counter}</button>
}
