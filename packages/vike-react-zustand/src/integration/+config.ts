import type { Config, ImportString } from 'vike/types'
import 'vike-react/config' // Needed for declaration merging of Config
import { vikeReactZustand } from '../plugin.js'

export default {
  name: 'vike-react-zustand',
  require: {
    'vike-react': '>=0.4.13',
  },
  Wrapper: 'import:vike-react-zustand/integration/Wrapper:default',
  passToClient: ['_vikeReactZustand'],
  vite: {
    plugins: [vikeReactZustand()],
  },
} satisfies Config
