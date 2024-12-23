export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleRegistry } from 'styled-jsx'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { styledJsx } = pageContext.config
  const registry = 'styledJsx' in pageContext ? pageContext.styledJsx?.registry : undefined

  if (styledJsx === null || !registry) {
    return <>{children}</>
  }

  return <StyleRegistry registry={registry}>{children}</StyleRegistry>
}
