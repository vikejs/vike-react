export { onAfterRenderHtml }

import React from 'react'
import { useConfig } from 'vike-react/useConfig'
import type { PageContext } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContext) {
  const config = useConfig()

  if (pageContext.styledComponentsSheet) {
    const { styledComponentsSheet } = pageContext
    try {
      const styles = styledComponentsSheet.getStyleElement()
      config({
        Head: styles,
      })
    } catch (error) {
      throw error
    } finally {
      styledComponentsSheet.seal()
    }
  }
}
