import type { Plugin } from 'vite'
import { initializers_remove } from '../../integration/context.js'
import { assert } from '../../utils.js'
import { transformCode } from './babelTransformer.js'

export const transform = (): Plugin => {
  const { idToStoreKeys } = global.vikeReactZustandExperimentalGlobalState
  return {
    name: 'vike-react-zustand-experimental:transform',
    enforce: 'post',
    async transform(code, id) {
      if (id.includes('node_modules') || !/[jt]sx?$/.test(id)) {
        return
      }
      const options = {
        id,
        addStoreKeys: true,
        stripTransfer: this.environment.name === 'client',
      }
      const result = await transformCode(code, options)

      if (!result.hasVikeReactZustandExperimental) {
        return
      }

      if (result.storeKeys.size > 0) {
        idToStoreKeys[id] = idToStoreKeys[id] || new Set()
        for (const key of result.storeKeys) {
          idToStoreKeys[id].add(key)
        }
      }

      return {
        code: result.code,
        map: result.map,
      }
    },
    handleHotUpdate(ctx) {
      const modules = ctx.modules.filter((m) => m.id && m.id in idToStoreKeys)
      if (!modules.length) return

      for (const module of modules.filter((m) => m.id)) {
        assert(module.id)
        const storeKeysInFile = idToStoreKeys[module.id]
        assert(storeKeysInFile)
        for (const key of storeKeysInFile) {
          initializers_remove(key)
        }
        delete idToStoreKeys[module.id]
      }

      ctx.server.ws.send({ type: 'full-reload' })
      return []
    },
  }
}
