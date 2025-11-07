export { Config }

import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import type { ConfigViaHook } from '../../types/Config.js'

function Config(props: ConfigViaHook): null {
  const config = useConfig()
  config(props)
  return null
}
