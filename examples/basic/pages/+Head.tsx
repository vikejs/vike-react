// Default <head> (can be overriden by pages)
export default Head

import React from 'react'
import logoUrl from '../assets/logo.svg'

const description = 'Playing with Restack'

function Head() {
  return (
    <>
      <link rel="icon" href={logoUrl} />
      <meta name="description" content={description} />
    </>
  )
}
