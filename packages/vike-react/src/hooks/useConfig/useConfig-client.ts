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

  // Favicon implementation: https://github.com/vikejs/vike-react/pull/113/files#diff-9158f1f6357dc1d187f30a09ccdf33ca999f0791a22cbe32fd3c9672901be0c4R14-R27
  // - I don't see a use case for it. (To be able to define a non-global per-page favicon.)
  //   - Dynamic favicons, like GMail or Discord, are independent of the page and should, therefore, be implemented on user-land.
}
