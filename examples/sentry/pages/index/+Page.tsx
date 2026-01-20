export { Page }

import { useState } from 'react'

function Page() {
  const [count, setCount] = useState(0)

  const throwError = () => {
    throw new Error('This is a test error sent to Sentry!')
  }

  const throwAsyncError = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    throw new Error('This is an async error sent to Sentry!')
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
      <h1>Vike + React + Sentry Example</h1>

      <p>This example demonstrates Sentry error tracking integration with Vike.</p>

      <div style={{ marginTop: '20px' }}>
        <h2>Counter: {count}</h2>
        <button onClick={() => setCount(count + 1)}>Increment</button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Test Error Tracking</h2>
        <p>Click these buttons to send test errors to Sentry:</p>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button
            onClick={throwError}
            style={{
              padding: '10px',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Throw Sync Error
          </button>

          <button
            onClick={throwAsyncError}
            style={{
              padding: '10px',
              backgroundColor: '#ff8844',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Throw Async Error
          </button>
        </div>
      </div>

      <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
        <h3>Configuration</h3>
        <p>
          Edit <code>pages/+config.ts</code> to configure your Sentry DSN and options.
        </p>
        <ul>
          <li>Client-side errors are automatically captured</li>
          <li>Server-side errors are automatically captured</li>
          <li>Distributed tracing connects server and client errors</li>
        </ul>
      </div>
    </div>
  )
}
