export { onBeforeRenderHtml }

import { createStyleRegistry } from 'styled-jsx'
import type { PageContext } from 'vike/types'

function onBeforeRenderHtml(pageContext: PageContext) {
  if (pageContext.config.styledJsx !== null) {
    pageContext.styledJsx = {
      registry: createStyleRegistry(),
    }
  }
}
