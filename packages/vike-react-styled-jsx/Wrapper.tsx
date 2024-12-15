export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleRegistry } from 'styled-jsx'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()

  if (pageContext.config.styledJsx === null) return <>{children}</>

  const styledJsx = 'styledJsx' in pageContext ? pageContext.styledJsx : undefined

  return <StyleRegistry registry={styledJsx?.registry}>{children}</StyleRegistry>
}
