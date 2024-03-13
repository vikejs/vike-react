import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault'
import Head from '../layouts/HeadDefault'
import vikeReact from 'vike-react/config'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + React App',
  ssr: true, // can be removed since `true` is the default
  extends: vikeReact
} satisfies Config
