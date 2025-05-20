export default {
  component: LoadingComponent,
}

import React from 'react'
/* We can't import it here: https://github.com/vikejs/vike/issues/2460
 * - We import it inside onRenderClient.js instead.
 * - We'll be able to do it if Vite + Rolldown always transpiles the server-side.
import './Loading.css'
*/

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
        aspectRatio: '2.5/1',
      }}
    />
  )
}
