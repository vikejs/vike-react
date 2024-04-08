export { config }

import type { Config } from 'vike/types'
import { LayoutDefault } from '../layouts/LayoutDefault'
import { HeadDefault } from '../layouts/HeadDefault'
import vikeReact from 'vike-react/config'

// Default configs (can be overridden by pages)
const config = {
  // <title>
  title: 'My Vike + React App',
  Head: HeadDefault,
  // https://vike.dev/Layout
  Layout: LayoutDefault,
  // https://vike.dev/ssr - this line can be removed since `true` is the default
  ssr: true,
  // https://vike.dev/extends
  extends: vikeReact
} satisfies Config
