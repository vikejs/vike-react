export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleSheetManager } from 'styled-components'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { styledComponents } = pageContext.config
  const sheet = 'styledComponents' in pageContext ? pageContext.styledComponents?.sheet : undefined

  if (styledComponents === null || !sheet) {
    return <>{children}</>
  }

  return (
    <StyleSheetManager sheet={sheet.instance} {...styledComponents?.styleSheetManager}>
      {children}
    </StyleSheetManager>
  )
}
