import React from 'react'

export default {
  component: LoadingComponent
}

function LoadingComponent() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100%',
        background: 'linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%)',
        borderRadius: '5px',
        backgroundSize: '200% 100%',
        animation: '1.3s vike-react-shine linear infinite',
        aspectRatio: '2.5/1'
      }}
    />
  )
}
