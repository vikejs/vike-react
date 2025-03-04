export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleSheetManager } from 'styled-components'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { styledComponents } = pageContext.config

  if (styledComponents === null) {
    return <>{children}</>
  }

  return (
    <StyleSheetManager sheet={pageContext.styledComponents!.sheet?.instance} {...styledComponents?.styleSheetManager}>
      {children}
    </StyleSheetManager>
  )
}
