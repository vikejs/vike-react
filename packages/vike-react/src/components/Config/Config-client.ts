export { Config }

import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import type { ConfigFromHook } from '../../types/Config.js'

function Config(props: ConfigFromHook): null {
  const config = useConfig()
  config(props)
  return null
}
