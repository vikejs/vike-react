export { Head }

import { useConfig } from '../../hooks/useConfig/useConfig-server.js'
import type React from 'react'

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
