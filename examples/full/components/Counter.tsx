export { Counter }

import React, { useState } from 'react'
import { useHydrated } from 'vike-react/useHydrated'

function Counter() {
  const [count, setCount] = useState(0)
  const isHydrated = useHydrated()
  return (
    <button disabled={!isHydrated} onClick={() => setCount((count) => count + 1)}>
      Counter {count}
    </button>
  )
}
