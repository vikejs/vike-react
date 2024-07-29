export type { ConfigSetter }

import type { ConfigFromHook } from '../../types/Config.js'

type ConfigSetter = (config: ConfigFromHook) => void
