export { useConfig }

import type { ConfigFromHook } from '../../types/Config.js'
import type { PageContextInternal } from '../../types/PageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { usePageContext } from '../usePageContext.js'

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
  return (config: ConfigFromHook) => {
    const headAlreadySet = '_headAlreadySet' in pageContext && pageContext._headAlreadySet

    // No need to use injectToStream()
    if (!headAlreadySet) {
      setUsingPageContext(config)
      return
    }

    const { title } = config
    if (title) window.document.title = title

    // Add support for following?
    // - favicon
    // - lang
  }
}
