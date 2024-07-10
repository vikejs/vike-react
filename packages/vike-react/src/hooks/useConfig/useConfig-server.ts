export { useConfig }

import type { ConfigFromHook } from '../../types/Config.js'
import type { PageContextInternal } from '../../types/PageContext.js'
import type { ConfigSetter } from './shared.js'
import { usePageContext } from '../usePageContext.js'
import { getPageContext } from 'vike/getPageContext'
import { useStream } from 'react-streaming'

const configsForSeoOnly = ['head'] as const

function useConfig(): ConfigSetter {
  const setOverPageContext = (config: ConfigFromHook) => {
    pageContext._configFromHook ??= {}
    // Remove SEO configs that the client-side don't need (in order to avoid serialization errors)
    if (pageContext.isClientSideNavigation) for (const configName of configsForSeoOnly) delete config[configName]
    Object.assign(pageContext._configFromHook, config)
  }

  // Vike hook
  let pageContext = getPageContext() as PageContextInternal
  if (pageContext) return setOverPageContext

  // React component
  pageContext = usePageContext()
  const stream = useStream()
  return (config: ConfigFromHook) => {
    if (!pageContext._headAlreadySet) {
      setOverPageContext(config)
    } else {
      // <head> already sent to the browser => send DOM-manipulating scripts during HTML streaming
      sideEffect(config, stream!)
    }
  }
}

type Stream = NonNullable<ReturnType<typeof useStream>>
function sideEffect(config: ConfigFromHook, stream: Stream) {
  const { title } = config
  if (title) {
    const htmlSnippet = `<script>document.title = ${JSON.stringify(title)}</script>`
    stream.injectToStream(htmlSnippet)
  }
}
