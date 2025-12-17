export { config as default }

import type { LocaleProviderProps, SystemContext } from '@chakra-ui/react'
import type { Config } from 'vike/types'

const config = {
  name: 'vike-react-chakra',
  require: {
    vike: '>=0.4.203',
    'vike-react': '>=0.4.13',
  },
  Wrapper: 'import:vike-react-chakra/__internal/Wrapper:Wrapper',
  meta: {
    chakra: {
      env: {
        server: true,
        client: true,
      },
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface Config {
      chakra?: null | {
        system?: SystemContext
        locale?: LocaleProviderProps['locale']
      }
    }
  }
}
