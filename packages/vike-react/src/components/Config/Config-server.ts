export { Config }

import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import type { ConfigViaComponent } from '../../types/Config.js'

/**
 * Set configurations inside React components.
 *
 * https://vike.dev/useConfig
 */
function Config(props: ConfigViaComponent): null {
  const config = useConfig()
  config(props)
  return null
}
