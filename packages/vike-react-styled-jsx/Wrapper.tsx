export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()

  if (pageContext.config.styledJsx === null) return <>{children}</>

  pageContext.styledJsxRegistry = createStyleRegistry()

  return <StyleRegistry registry={pageContext.styledJsxRegistry}>{children}</StyleRegistry>
}
