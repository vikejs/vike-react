export { onBeforeRenderHtml }

import { ServerStyleSheet } from 'styled-components'
import type { PageContext } from 'vike/types'

function onBeforeRenderHtml(pageContext: PageContext) {
  if (pageContext.config.styledComponents !== null) {
    pageContext.config.styledComponents ??= {}
    pageContext.styledComponentsSheet = new ServerStyleSheet()
  }
}
