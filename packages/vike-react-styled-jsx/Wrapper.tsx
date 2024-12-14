export { Wrapper }

import React, { type ReactNode } from 'react'
import { StyleRegistry, createStyleRegistry } from 'styled-jsx'
import { usePageContext } from 'vike-react/usePageContext'

function Wrapper({ children }: { children: ReactNode }) {
  const pageContext = usePageContext()

  if (isBrowser() || pageContext.config.styledJsx === null) return <>{children}</>

  pageContext.config.styledJsx ??= createStyleRegistry()

  return <StyleRegistry registry={pageContext.config.styledJsx}>{children}</StyleRegistry>
}

function isBrowser() {
  // Using `typeof window !== 'undefined'` alone is not enough because some users use https://www.npmjs.com/package/ssr-window
  return typeof window !== 'undefined' && typeof window.scrollY === 'number'
  // Alternatively, test whether environment is a *real* browser: https://github.com/brillout/picocolors/blob/d59a33a0fd52a8a33e4158884069192a89ce0113/picocolors.js#L87-L89
}
