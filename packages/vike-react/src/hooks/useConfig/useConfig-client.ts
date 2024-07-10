export { useConfig }

import type { ConfigFromHook } from '../../types/Config.js'
import { useConfigShared, type ConfigSetter } from './shared.js'

function useConfig(): ConfigSetter {
  return useConfigShared(sideEffect)
}

function sideEffect(config: ConfigFromHook) {
  const { title } = config
  if (title) window.document.title = title
}
