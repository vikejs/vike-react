export { useConfig }

import type { ConfigFromHook } from '../../types/Config.js'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigSetter } from './shared.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'

function useConfig(): ConfigSetter {
  const setOverPageContext = (config: ConfigFromHook) => {
    pageContext._configFromHook ??= {}
    Object.assign(pageContext._configFromHook, config)
  }

  // Vike hook
  let pageContext = getPageContext() as PageContextInternal
  if (pageContext) return setOverPageContext

  // React component
  pageContext = usePageContext()
  return (config: ConfigFromHook) => {
    if (!('_headAlreadySet' in pageContext)) {
      setOverPageContext(config)
    } else {
      sideEffect(config)
    }
  }
}

function sideEffect(config: ConfigFromHook) {
  const { title } = config
  if (title) {
    window.document.title = title
  }
}
