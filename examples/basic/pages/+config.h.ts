import type { Config } from 'vite-plugin-ssr/types'
import Layout from '../layouts/LayoutDefault'
import Head from '../layouts/HeadDefault'
import logoUrl from '../assets/logo.svg'
import vikeReact from 'vike-react'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + React App',
  // <meta name="description">
  description: 'Demo showcasing Vike + React',
  // <link rel="icon" href="${favicon}" />
  favicon: logoUrl,
  extends: vikeReact
} satisfies Config
