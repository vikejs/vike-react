import type { Config } from 'restack'
import Layout from '../layouts/LayoutDefault'
import logoUrl from '../assets/logo.svg'

// Default configs (can be overriden by pages)
export default {
  Layout,
  // <title>
  title: 'My Restack App',
  // <meta name="description">
  description: 'Demo showcasing Restack',
  // <link rel="icon" href="${favicon}" />
  favicon: logoUrl
} satisfies Config
