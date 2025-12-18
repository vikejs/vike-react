console.log('This will only run on the client side.')
import React from 'react'

export default function ClientOnlyComponent() {
  return (
    <div>
      <h1>Client Only Component</h1>
      <p>This component is rendered only on the client side.</p>
    </div>
  )
}
