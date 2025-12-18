export { useConfig }
import type { PageContext } from 'vike/types'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigViaHook } from '../../types/Config.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { useStreamOptional } from 'react-streaming'
import { objectKeys } from '../../utils/objectKeys.js'
import { includes } from '../../utils/includes.js'
import { assert } from '../../utils/assert.js'
import { configsCumulative } from './configsCumulative.js'

/**
 * Set configurations inside components and Vike hooks.
 *
 * https://vike.dev/useConfig
 */
function useConfig(): (config: ConfigViaHook) => void {
  // Vike hook
  let pageContext = getPageContext({ asyncHook: false }) as PageContext & PageContextInternal
  if (pageContext) return (config: ConfigViaHook) => setPageContextConfigViaHook(config, pageContext)

  // Component
  pageContext = usePageContext()
  const stream = useStreamOptional()
  return (config: ConfigViaHook) => {
    if (!pageContext._headAlreadySet) {
      setPageContextConfigViaHook(config, pageContext)
    } else {
      assert(stream)
      // <head> already sent to the browser => send DOM-manipulating scripts during HTML streaming
      apply(config, stream, pageContext)
    }
  }
}

const configsClientSide = ['title']
function setPageContextConfigViaHook(config: ConfigViaHook, pageContext: PageContext & PageContextInternal) {
  pageContext._configViaHook ??= {}
  objectKeys(config).forEach((configName) => {
    // Skip HTML only configs which the client-side doesn't need, saving KBs sent to the client as well as avoiding serialization errors.
    if (pageContext.isClientSideNavigation && !configsClientSide.includes(configName)) return

    if (!includes(configsCumulative, configName)) {
      // Overridable config
      const configValue = config[configName]
      if (configValue === undefined) return
      pageContext._configViaHook![configName] = configValue as any
    } else {
      // Cumulative config
      const configValue = config[configName]
      if (!configValue) return
      pageContext._configViaHook![configName] ??= []
      pageContext._configViaHook![configName].push(configValue as any)
    }
  })
}

type Stream = NonNullable<ReturnType<typeof useStreamOptional>>
function apply(config: ConfigViaHook, stream: Stream, pageContext: PageContext) {
  const { title } = config
  if (title) {
    // Add CSP nonce attribute if configured
    // No need to escape — pageContext.cspNonce is controlled by the developer, not by the website visitor
    const nonceAttr = (pageContext as any).cspNonce ? ` nonce="${(pageContext as any).cspNonce}"` : ''
    const htmlSnippet = `<script${nonceAttr}>document.title = ${JSON.stringify(title)}</script>`
    stream.injectToStream(htmlSnippet)
  }
}
