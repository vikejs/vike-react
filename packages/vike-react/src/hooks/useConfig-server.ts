export { useConfig }

import type { ConfigFromHook } from '../types/Config.js'
import type { PageContextInternal } from '../types/PageContext.js'
import { assert } from '../utils/assert.js'
import { usePageContext } from './usePageContext.js'
import { useStream } from 'react-streaming'
import { getPageContext } from 'vike/getPageContext'

function useConfig(): (config: ConfigFromHook) => void {
  const setUsingPageContext = (config: ConfigFromHook) => {
    pageContext._configFromHook ??= {}
    Object.assign(pageContext._configFromHook, config)
  }

  // getPageContext() enables useConfig() to be used for Vike hooks
  let pageContext = getPageContext() as PageContextInternal
  if (pageContext) return setUsingPageContext

  // usePageContext() enables useConfig() to be used as React hook for React components
  pageContext = usePageContext()
  const stream = useStream()
  return (config: ConfigFromHook) => {
    const headAlreadySet = pageContext._headAlreadySet

    // No need to use injectToStream()
    if (!headAlreadySet) {
      setUsingPageContext(config)
      return
    }

    // <head> already sent to the browser => send DOM-manipulating scripts during HTML streaming
    assert(stream)
    {
      const { title } = config
      if (title) {
        assert(typeof title === 'string')
        // JSON is safe, thus JSON.stringify() should as well.
        const htmlSnippet = `<script>document.title = ${JSON.stringify(title)}</script>`
        stream.injectToStream(htmlSnippet)
      }
    }
  }
}
