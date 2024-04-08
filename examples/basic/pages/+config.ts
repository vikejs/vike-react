export { config }

import type { Config } from 'vike/types'
import { LayoutDefault } from '../layouts/LayoutDefault'
import { HeadDefault } from '../layouts/HeadDefault'
import vikeReact from 'vike-react/config'

// Default configs (can be overridden by pages)
const config = {
  Layout: LayoutDefault,
  Head: HeadDefault,
  // <title>
  title: 'My Vike + React App',
  // Enable HTML streaming (https://vike.dev/stream)
  stream: true,
  extends: vikeReact
} satisfies Config
