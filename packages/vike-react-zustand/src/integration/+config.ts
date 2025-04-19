import 'vike-react/config'; // Needed for declaration merging of Config
import type { Config } from 'vike/types'
import { vikeReactZustand } from '../plugin/index.js'

export default {
  name: 'vike-react-zustand',
  require: {
    'vike-react': '>=0.4.13',
  },
  Wrapper: 'import:vike-react-zustand/integration/Wrapper:default',
  onBeforeRender: 'import:vike-react-zustand/integration/onBeforeRender:default',
  //@ts-expect-error
  onBeforeRenderClient: 'import:vike-react-zustand/integration/onBeforeRenderClient:default',
  passToClient: ['_vikeReactZustand'],
  vite: {
    plugins: [vikeReactZustand()],
  },
} satisfies Config
