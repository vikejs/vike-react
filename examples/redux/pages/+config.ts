import type { Config } from 'vike/types'
import Layout from '../layouts/LayoutDefault'
import Head from '../layouts/HeadDefault'
import vikeReact from 'vike-react/config'
import vikeReactRedux from 'vike-react-redux/config'

// Default configs (can be overridden by pages)
export default {
  Layout,
  Head,
  // <title>
  title: 'My Vike + React App',
  extends: [vikeReact, vikeReactRedux],
  passToClient: ['routeParams'],
} satisfies Config
