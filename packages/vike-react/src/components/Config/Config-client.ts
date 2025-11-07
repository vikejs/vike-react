export { Config }

import { useConfig } from '../../hooks/useConfig/useConfig-client.js'
import type { ConfigViaComponent } from '../../types/Config.js'

function Config(props: ConfigViaComponent): null {
  const config = useConfig()
  config(props)
  return null
}
