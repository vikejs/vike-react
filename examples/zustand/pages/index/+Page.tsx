export default Page

import React from 'react'
import { Counter } from './Counter'
import { useStore } from '../../store'

function Page() {
  const nodeVersion = useStore((s) => s.nodeVersion)
  return (
    <>
      <h1>My Vike + React app</h1>
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive while loading. <Counter />
        </li>
      </ul>
      <div>Node version from server: {nodeVersion}</div>
    </>
  )
}
