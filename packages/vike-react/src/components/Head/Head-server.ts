export { Head }

// Same as ./Head-client.ts but importing useConfig-server.js

import { useConfig } from '../../hooks/useConfig/useConfig-server.js'

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
