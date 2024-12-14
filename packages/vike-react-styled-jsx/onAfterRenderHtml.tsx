export { onAfterRenderHtml }

import React from 'react'
import { useConfig } from 'vike-react/useConfig'
import type { PageContext } from 'vike/types'

function onAfterRenderHtml(pageContext: PageContext) {
  const config = useConfig()
  const registry = pageContext.styledJsxRegistry

  if (registry) {
    const nonce = pageContext.config.styledJsx?.nonce
    const styles = registry.styles({ nonce })

    config({
      Head: (
        <>
          {nonce ? <meta property="csp-nonce" content={nonce} /> : ''}
          {styles}
        </>
      ),
    })

    registry.flush()
  }
}
