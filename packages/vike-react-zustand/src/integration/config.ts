import type { Config } from 'vike/types'
import { vikeReactZustand } from '../plugin/index.js'
import 'vike-react/config' // Needed for merging vike-react's Vike.Config such as +stream

export default {
  name: 'vike-react-zustand',
  require: {
    vike: '>=0.4.242',
    'vike-react': '>=0.4.13',
  },
  stream: { require: true },
  vite: {
    plugins: [vikeReactZustand()],
  },
} satisfies Config
