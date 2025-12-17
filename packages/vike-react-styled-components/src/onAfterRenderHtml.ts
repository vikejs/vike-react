export { onAfterRenderHtml }

import { useConfig } from 'vike-react/useConfig'
import type { PageContext } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContext) {
  const config = useConfig()
  const sheet = pageContext.styledComponents?.sheet

  if (sheet) {
    try {
      const styles = sheet.getStyleElement()
      config({
        Head: styles,
      })
    } catch (error) {
      throw error
    } finally {
      sheet.seal()
    }
  }
}
