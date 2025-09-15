export default {
  component: LoadingComponent,
}

import React from 'react'

function LoadingComponent() {
  return (
    <>
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
      <style
        href="vike-react-loading"
        // https://react.dev/reference/react-dom/components/style#special-rendering-behavior
        // https://github.com/vikejs/vike-react/pull/184#discussion_r2348075206
        precedence="default"
      >
        {`
          @keyframes vike-react-loading {
            to {
              background-position-x: -200%;
            }
          }
        `}
      </style>
    </>
  )
}
