export default Page

import React, { useEffect, useState } from 'react'
import { Counter } from '../../components/Counter'

function Page() {
  const [isThrowing, setIsThrowing] = useState(false)
  useEffect(() => {
    if (window.location.search === '?effect') throw new Error('Thrown by an effect')
  }, [])
  if (isThrowing) throw new Error('Thrown after the page rendered')
  return (
    <>
      <Counter />
      <button id="throw" onClick={() => setIsThrowing(true)}>
        Throw
      </button>
    </>
  )
}
