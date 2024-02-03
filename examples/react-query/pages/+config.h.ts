import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault'
import Head from '../layouts/HeadDefault'
import vikeReact from 'vike-react/config'
import vikeReactQuery from 'vike-react-query/config'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + React App',
  extends: [vikeReact, vikeReactQuery],
  passToClient: ['routeParams']
} satisfies Config
