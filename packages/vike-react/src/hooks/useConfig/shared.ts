export { useConfigShared }
export type { ConfigSetter }

import type { ConfigFromHook } from '../../types/Config.js'
import type { PageContextInternal } from '../../types/PageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { usePageContext } from '../usePageContext.js'

type ConfigSetter = (config: ConfigFromHook) => void

const configsForSeoOnly = ['head'] as const

function useConfigShared(sideEffect: (config: ConfigFromHook) => void): ConfigSetter {
  const setUsingPageContext = (config: ConfigFromHook) => {
    pageContext._configFromHook ??= {}
    // Avoid passing SEO configs to the client-side
    if (pageContext.isClientSideNavigation) for (const configName of configsForSeoOnly) delete config[configName]
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

    sideEffect(config)
  }
}
