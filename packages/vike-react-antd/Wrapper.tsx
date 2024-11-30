export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleProvider } from '@ant-design/cssinjs'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()
  const { antd } = pageContext.config

  if (antd === null) {
    return <>{children}</>
  }

  return <StyleProvider {...antd}>{children}</StyleProvider>
}
