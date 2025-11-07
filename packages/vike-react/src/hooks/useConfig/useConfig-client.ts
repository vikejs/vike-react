export { useConfig }

import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigViaComponent } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { applyHeadSettings } from '../../integration/applyHeadSettings.js'

function useConfig(): (config: ConfigViaComponent) => void {
  // Vike hook
  let pageContext = getPageContext() as PageContext & PageContextInternal
  if (pageContext) return (config: ConfigViaComponent) => setPageContextConfigViaComponent(config, pageContext)

  // Component
  pageContext = usePageContext()
  return (config: ConfigViaComponent) => {
    if (!('_headAlreadySet' in pageContext)) {
      setPageContextConfigViaComponent(config, pageContext)
    } else {
      applyHead(config)
    }
  }
}

function setPageContextConfigViaComponent(config: ConfigViaComponent, pageContext: PageContextInternal) {
  pageContext._configViaComponent ??= {}
  Object.assign(pageContext._configViaComponent, config)
}

function applyHead(config: ConfigViaComponent) {
  const { title, lang } = config
  applyHeadSettings(title, lang)
}
