export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleRegistry } from 'styled-jsx'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()

  if (pageContext.config.styledJsx === null) return <>{children}</>

  if ('styledJsx' in pageContext) {
    return <StyleRegistry registry={pageContext.styledJsx?.registry}>{children}</StyleRegistry>
  }
  return <>{children}</>
}
