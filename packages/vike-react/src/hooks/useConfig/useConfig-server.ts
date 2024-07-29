export { useConfig }

import type { ConfigFromHook } from '../../types/Config.js'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigSetter } from './shared.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { useStream } from 'react-streaming'

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
  const stream = useStream()
  return (config: ConfigFromHook) => {
    if (!pageContext._headAlreadySet) {
      configSetter(config)
    } else {
      // <head> already sent to the browser => send DOM-manipulating scripts during HTML streaming
      sideEffect(config, stream!)
    }
  }
}

const configsForSeoOnly = ['Head'] as const
const configsCumulative = ['Head'] as const
const configsOverridable = ['title'] as const
function setConfigOverPageContext(config: ConfigFromHook, pageContext: PageContextInternal) {
  pageContext._configFromHook ??= {}

  if (pageContext.isClientSideNavigation) {
    // Remove SEO configs which the client-side doesn't need (also avoiding serialization errors)
    for (const configName of configsForSeoOnly) delete config[configName]
  }

  // Cumulative values
  configsCumulative.forEach((configName) => {
    const configValue = config[configName]
    if (!configValue) return
    pageContext._configFromHook![configName] ??= []
    pageContext._configFromHook![configName].push(configValue)
  })

  // Overridable values
  configsOverridable.forEach((configName) => {
    const configValue = config[configName]
    if (!configValue) return
    pageContext._configFromHook![configName] = configValue
  })
}

type Stream = NonNullable<ReturnType<typeof useStream>>
function sideEffect(config: ConfigFromHook, stream: Stream) {
  const { title } = config
  if (title) {
    const htmlSnippet = `<script>document.title = ${JSON.stringify(title)}</script>`
    stream.injectToStream(htmlSnippet)
  }
}
