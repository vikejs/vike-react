export default HeadDefault

import React from 'react'
import logoUrl from '../assets/logo.svg'

function HeadDefault() {
  return (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href={logoUrl} />
    </>
  )
}
