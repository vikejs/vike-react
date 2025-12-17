export { onAfterRenderHtml }

import { useConfig } from 'vike-react/useConfig'
import type { PageContext } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContext) {
  const config = useConfig()
  const registry = pageContext.styledJsx?.registry

  if (registry) {
    const nonce = pageContext.config.styledJsx?.nonce
    const styles = registry.styles({ nonce })

    config({
      Head: styles,
    })

    registry.flush()
  }
}
