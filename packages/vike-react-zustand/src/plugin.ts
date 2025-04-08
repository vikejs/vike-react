export { vikeReactZustand }

import type { Plugin } from 'vite'
import { initializers_remove } from './renderer/context.js'
import { assert } from './utils.js'
import { init, parse } from 'es-module-lexer'

function vikeReactZustand(): Plugin {
  const idToStoreKeys: { [id: string]: Set<string> } = {}
  return {
    name: 'vikeReactZustand',
    enforce: 'post',
    async transform(code, id) {
      if (id.includes('node_modules')) {
        return
      }
      const res = parse(code)
      const match = res[0].find((line) => line.n === 'vike-react-zustand')
      if (!match) {
        return
      }
      const importLine = code.slice(match.ss, match.se)
      const imports = importLine
        .substring(importLine.indexOf('{') + 1, importLine.indexOf('}'))
        .split(',')
        .map((s) => s.trim())
        .filter((s) => {
          const split = s.split(' as ')
          return (
            split.length === 1 ||
            // create as create
            split[0] === split[1]
          )
        })
      if (!imports.includes('create')) {
        return
      }

      // Playground: https://regex101.com/r/oDNRzp/1
      let parts = code.split(/(?<=[\s:=,;])create\s*?\(/g)
      if (parts.length <= 1) {
        return
      }

      idToStoreKeys[id] = idToStoreKeys[id] || new Set()
      let result = parts[0]
      for (let i = 1; i < parts.length; i++) {
        const key = simpleHash(`${id}:${i - 1}`)
        idToStoreKeys[id].add(key)
        result += `create('${key}',` + parts[i]
      }

      // We only modify the column number by a few characters
      // - create(() => {})
      // + create('key', () => {})
      return { code: result, map: null }
    },
    async buildStart() {
      await init
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

function simpleHash(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(36)
}
