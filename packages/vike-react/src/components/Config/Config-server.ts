export { Config }

// server-side import
import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import type { ConfigFromHook } from '../../types/Config.js'

function Config(props: ConfigFromHook): null {
  const config = useConfig()
  config(props)
  return null
}
