export { onAfterRenderHtml }

import React from 'react'
import { extractStyle } from '@ant-design/cssinjs'
import { useConfig } from 'vike-react/useConfig'
import type { PageContext } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContext) {
  const config = useConfig()

  if (pageContext.config.antd?.cache) {
    const styleTag = React.createElement('style', {
      id: 'antd-cssinjs',
      dangerouslySetInnerHTML: {
        __html: extractStyle(pageContext.config.antd.cache, true),
      },
    })
    config({
      Head: styleTag,
    })
  }
}
