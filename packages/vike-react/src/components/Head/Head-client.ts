export { Head }

// Same as ./Head-server.ts but importing useConfig-client.js

import { useConfig } from '../../hooks/useConfig/useConfig-client.js'

/**
 * Add arbitrary `<head>` tags.
 *
 * (The children are teleported to `<head>`.)
 *
 * https://vike.dev/Head
 */
function Head({ children }: { children: React.ReactNode }): null {
  const config = useConfig()
  config({ Head: children })
  return null
}
