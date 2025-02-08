export { config }

import vikeReact from 'vike-react/config'
import Layout from '@layouts/LayoutDefault'
import Head from '@layouts/HeadDefault'

const config = {
  // https://vike.dev/Layout
  Layout,
  Head,
  // https://vike.dev/extends
  extends: vikeReact,
}
