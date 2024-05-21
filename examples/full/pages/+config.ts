export { config }

import type { Config } from 'vike/types'
import { LayoutDefault } from '../layouts/LayoutDefault'
import vikeReact from 'vike-react/config'
import logoUrl from '../assets/logo.svg'

// Default configs (can be overridden by pages)
const config = {
  // <title>
  //*
  document: {
    title: 'My Vike + React App',
    description: 'Demo showcasing Vike + React',
    viewport: 'responsive',
    icon: logoUrl
  },
  /*/
  favicon: logoUrl,
  //*/
  // https://vike.dev/Layout
  Layout: LayoutDefault,
  // https://vike.dev/stream
  stream: true,
  // https://vike.dev/ssr - this line can be removed since `true` is the default
  ssr: true,
  // https://vike.dev/extends
  extends: vikeReact
} satisfies Config
