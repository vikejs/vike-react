export { onBeforeRenderHtml }

import { createCache } from '@ant-design/cssinjs'
import type { PageContext } from 'vike/types'

function onBeforeRenderHtml(pageContext: PageContext) {
  if (pageContext.config.antd !== null) {
    pageContext.antd = {
      cache: createCache(),
    }
  }
}
