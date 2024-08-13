export { useConfig }
export type ConfigFromHookCumulative = (typeof configsCumulative)[number]

import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigFromHook } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { useStream } from 'react-streaming'
import { objectKeys } from '../../utils/objectKeys.js'
import { includes } from '../../utils/includes.js'

/**
 * Set configurations inside components and Vike hooks.
 *
 * https://vike.dev/useConfig
 */
function useConfig(): (config: ConfigFromHook) => void {
  // Vike hook
  let pageContext = getPageContext() as PageContext & PageContextInternal
  if (pageContext) return (config: ConfigFromHook) => setPageContextConfigFromHook(config, pageContext)

  // Component
  pageContext = usePageContext()
  const stream = useStream()
  return (config: ConfigFromHook) => {
    if (!pageContext._headAlreadySet) {
      setPageContextConfigFromHook(config, pageContext)
    } else {
      // <head> already sent to the browser => send DOM-manipulating scripts during HTML streaming
      apply(config, stream!)
    }
  }
}

const configsClientSide = ['title']
const configsCumulative = ['Head', 'bodyAttributes', 'htmlAttributes'] as const
function setPageContextConfigFromHook(config: ConfigFromHook, pageContext: PageContext & PageContextInternal) {
  pageContext._configFromHook ??= {}
  objectKeys(config).forEach((configName) => {
    // Skip HTML only configs which the client-side doesn't need, saving KBs sent to the client as well as avoiding serialization errors.
    if (pageContext.isClientSideNavigation && !configsClientSide.includes(configName)) return

    if (!includes(configsCumulative, configName)) {
      // Overridable config
      const configValue = config[configName]
      if (configValue === undefined) return
      pageContext._configFromHook![configName] = configValue as any
    } else {
      // Cumulative config
      const configValue = config[configName]
      if (!configValue) return
      pageContext._configFromHook![configName] ??= []
      pageContext._configFromHook![configName].push(configValue as any)
    }
  })
}

type Stream = NonNullable<ReturnType<typeof useStream>>
function apply(config: ConfigFromHook, stream: Stream) {
  const { title } = config
  if (title) {
    const htmlSnippet = `<script>document.title = ${JSON.stringify(title)}</script>`
    stream.injectToStream(htmlSnippet)
  }
}
