export { useConfig }

import type { ConfigFromHook } from '../../types/Config.js'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigSetter } from './shared.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'

/**
 * Set configurations inside React components and Vike hooks.
 *
 * https://vike.dev/useConfig
 */
function useConfig(): ConfigSetter {
  const configSetter = (config: ConfigFromHook) => setConfigOverPageContext(config, pageContext)

  // Vike hook
  let pageContext = getPageContext() as PageContextInternal
  if (pageContext) return configSetter

  // React component
  pageContext = usePageContext()
  return (config: ConfigFromHook) => {
    if (!('_headAlreadySet' in pageContext)) {
      configSetter(config)
    } else {
      sideEffect(config)
    }
  }
}

const configsClientSide = ['title'] as const
function setConfigOverPageContext(config: ConfigFromHook, pageContext: PageContextInternal) {
  pageContext._configFromHook ??= {}

  configsClientSide.forEach((configName) => {
    const configValue = config[configName]
    if (!configValue) return
    pageContext._configFromHook![configName] = configValue
  })
}

function sideEffect(config: ConfigFromHook) {
  const { title } = config
  if (title) {
    window.document.title = title
  }

  // Favicon implementation: https://github.com/vikejs/vike-react/pull/113/files#diff-9158f1f6357dc1d187f30a09ccdf33ca999f0791a22cbe32fd3c9672901be0c4R14-R27
  // - I don't see a use case for it. (To be able to define a non-global per-page favicon.)
  //   - Dynamic favicons, like GMail or Discord, are independent of the page and should, therefore, be implemented on user-land.
  // - TODO: remove this comment and make setting +favicon global (or deprecate it)
  //   - Document how to implement a dynamic favicon. It's a nice example of how to create a custom document setting.
