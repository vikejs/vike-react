export { useConfig }

import type { ConfigFromHook } from '../types/Config.js'

function useConfig(): (config: ConfigFromHook) => void {
  return (config) => {
    const { title } = config
    if (title) window.document.title = title

    // Add support for following?
    // - favicon
    // - lang
  }
}
