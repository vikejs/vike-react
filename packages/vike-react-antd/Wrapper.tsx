export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { antd } = pageContext.config
  const cache = 'antd' in pageContext ? pageContext.antd?.cache : undefined

  if (antd === null || !cache) {
    return <>{children}</>
  }

  return (
    <StyleProvider cache={cache} {...antd}>
      {children}
    </StyleProvider>
  )
}
