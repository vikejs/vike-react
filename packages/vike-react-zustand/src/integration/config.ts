import 'vike-react/config' // Needed for declaration merging of Config
import type { Config } from 'vike/types'
import { vikeReactZustand } from '../plugin/index.js'

export default {
  name: 'vike-react-zustand',
  require: {
    'vike-react': '>=0.4.13',
  },
  onAfterRenderHtml: 'import:vike-react-zustand/__internal/integration/onAfterRenderHtml:onAfterRenderHtml',
  passToClient: ['_vikeReactZustandState'],
  vite: {
    plugins: [vikeReactZustand()],
  },
} satisfies Config
