import type { Config } from 'vike/types'
import { vikeReactZustand } from '../plugin/index.js'

export default {
  name: 'vike-react-zustand',
  require: {
    'vike-react': '>=0.4.13',
  },
  vite: {
    plugins: [vikeReactZustand()],
  },
} satisfies Config
