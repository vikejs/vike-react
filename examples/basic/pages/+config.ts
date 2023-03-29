import type { Config } from 'restack'
import Layout from '../layouts/LayoutDefault'

// Default configs (can be overriden by pages)
export default {
  Layout,
  // <title>
  title: 'My Restack App',
  // <meta name="description">
  description: 'Demo showcasing Restack'
} satisfies Config
