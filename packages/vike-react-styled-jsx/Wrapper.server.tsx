export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleRegistry } from 'styled-jsx'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { styledJsx } = pageContext.config

  if (styledJsx === null) {
    return <>{children}</>
  }

  return <StyleRegistry registry={pageContext.styledJsx!.registry}>{children}</StyleRegistry>
}
