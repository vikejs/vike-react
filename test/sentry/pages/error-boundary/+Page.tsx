export { Page }

import { Component, type ReactNode, useState } from 'react'

function Page() {
  return (
    <ErrorBoundary>
      <Thrower />
    </ErrorBoundary>
  )
}

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    return this.state.hasError ? <p>Error caught</p> : this.props.children
  }
}

function Thrower() {
  const [hasError, setHasError] = useState(false)
  if (hasError) throw new Error('BOUNDARY_CAUGHT')
  return <button onClick={() => setHasError(true)}>Throw Caught Error</button>
}
