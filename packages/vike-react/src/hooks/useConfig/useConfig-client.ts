export { useConfig }

import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigViaHook } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { applyHeadSettings } from '../../integration/applyHeadSettings.js'
import { objectKeys } from '../../utils/objectKeys.js'

function useConfig(): (config: ConfigViaHook) => void {
  // Vike hook
  let pageContext = getPageContext({ asyncHook: false }) as PageContext & PageContextInternal
  if (pageContext) return (config: ConfigViaHook) => setPageContextConfigViaHook(config, pageContext)

  // Component
  pageContext = usePageContext()
  return (config: ConfigViaHook) => {
    if (!pageContext._headAlreadySet) {
      // Upon client-side navigation, onRenderClient() applies the head settings after the page is rendered
      setPageContextConfigViaHook(config, pageContext)
    } else {
      applyHead(config)
    }
  }
}

function setPageContextConfigViaHook(config: ConfigViaHook, pageContext: PageContextInternal) {
  pageContext._configViaHook ??= {}
  objectKeys(config).forEach((configName) => {
    const configValue = config[configName]
    // Same as on the server-side: `undefined` doesn't override the value set by a previous useConfig() call
    if (configValue === undefined) return
    pageContext._configViaHook![configName] = configValue as any
  })
}

function applyHead(config: ConfigViaHook) {
  const { title, lang } = config
  applyHeadSettings(title, lang)
}
