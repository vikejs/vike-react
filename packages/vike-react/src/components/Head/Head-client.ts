export { Head }

// Same as ./Head-server.ts but importing useConfig-client.js

import { useConfig } from '../../hooks/useConfig/useConfig-client.js'

/**
 * Children teleported to &lt;head>
 *
 * https://vike.dev/Head
 */
function Head({ children }: { children: React.ReactNode }): null {
  const config = useConfig()
  config({ Head: children })
  return null
}
