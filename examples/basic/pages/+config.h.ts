export { config }

import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault'
import Head from '../layouts/HeadDefault'
import vikeReact from 'vike-react'

// Default configs (can be overridden by pages)
const config = {
  Layout,
  Head,
  // <title>
  title: 'My Vike + React App',
  extends: vikeReact
} satisfies Config
