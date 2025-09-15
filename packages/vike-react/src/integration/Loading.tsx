export default {
  component: LoadingComponent,
}

import React from 'react'

function LoadingComponent() {
  return (
    <>
      <style href="VikeReactLoading" precedence="low">
        {`
          @keyframes vike-react-loading {
            to {
              background-position-x: -200%;
            }
          }
        `}
      </style>
      <div
        style={{
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          background: 'linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%)',
          borderRadius: '5px',
          backgroundSize: '200% 100%',
          animation: '1.3s vike-react-loading linear infinite',
          aspectRatio: '2.5/1',
        }}
      />
    </>
  )
}
