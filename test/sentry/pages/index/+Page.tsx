export { Page }

import { useState } from 'react'
import logo from './logo.svg'

function Page() {
  const [count, setCount] = useState(0)
  const [hasRenderError, setHasRenderError] = useState(false)

  if (hasRenderError) {
    throw new Error('This is a render error sent to Sentry!')
  }

  const throwError = () => {
    throw new Error('This is a test error sent to Sentry!')
  }

  const throwAsyncError = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    throw new Error('This is an async error sent to Sentry!')
  }

  return (
    <>
      <img src={logo} alt="Logo" width={32} height={32} />
      <h1>Vike + React + Sentry Example</h1>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={throwError}>Throw Sync Error</button>
      <button onClick={throwAsyncError}>Throw Async Error</button>
      <button onClick={() => setHasRenderError(true)}>Throw Render Error</button>
    </>
  )
}
