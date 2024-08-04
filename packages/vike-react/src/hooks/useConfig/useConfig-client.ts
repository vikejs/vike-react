export { useConfig }

import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigFromHook } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'

/**
 * Set configurations inside React components and Vike hooks.
 *
 * https://vike.dev/useConfig
 */
function useConfig(): (config: ConfigFromHook) => void {
  const configSetter = (config: ConfigFromHook) => setConfigOverPageContext(config, pageContext)

  // Vike hook
  let pageContext = getPageContext() as PageContext & PageContextInternal
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
}
