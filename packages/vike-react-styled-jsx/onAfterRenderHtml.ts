import { useConfig } from 'vike-react/useConfig'
import { PageContext } from 'vike/types'

export { onAfterRenderHtml }

function onAfterRenderHtml(pageContext: PageContext) {
  const config = useConfig()
  const registry = pageContext.config.styledJsx

  if (registry) {
    const styles = registry.styles()

    config({
      Head: styles,
    })

    registry.flush()
  }
}
