export { useConfig }

import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigViaHook } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { applyHeadSettings } from '../../integration/applyHeadSettings.js'

function useConfig(): (config: ConfigViaHook) => void {
  // Vike hook
  let pageContext = getPageContext() as PageContext & PageContextInternal
  if (pageContext) return (config: ConfigViaHook) => setPageContextConfigViaHook(config, pageContext)

  // Component
  pageContext = usePageContext()
  return (config: ConfigViaHook) => {
    if (!('_headAlreadySet' in pageContext)) {
      setPageContextConfigViaHook(config, pageContext)
    } else {
      applyHead(config)
    }
  }
}

function setPageContextConfigViaHook(config: ConfigViaHook, pageContext: PageContextInternal) {
  pageContext._configViaHook ??= {}
  Object.assign(pageContext._configViaHook, config)
}

function applyHead(config: ConfigViaHook) {
  const { title, lang } = config
  applyHeadSettings(title, lang)
}
