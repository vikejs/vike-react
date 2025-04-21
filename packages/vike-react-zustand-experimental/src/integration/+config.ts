import 'vike-react/config' // Needed for declaration merging of Config
import type { Config } from 'vike/types'
import { vikeReactZustandExperimental } from '../plugin/index.js'

export default {
  name: 'vike-react-zustand-experimental',
  require: {
    'vike-react': '>=0.4.13',
  },
  Wrapper: 'import:vike-react-zustand-experimental/integration/Wrapper:default',
  onBeforeRender: 'import:vike-react-zustand-experimental/integration/onBeforeRender:default',
  //@ts-expect-error
  onBeforeRenderClient: 'import:vike-react-zustand-experimental/integration/onBeforeRenderClient:default',
  passToClient: ['_vikeReactZustandExperimentalTransfer'],
  vite: {
    plugins: [vikeReactZustandExperimental()],
  },
} satisfies Config
