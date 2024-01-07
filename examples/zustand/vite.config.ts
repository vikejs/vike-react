import react from '@vitejs/plugin-react'
import { init, parse } from 'es-module-lexer'
import vike from 'vike/plugin'
import type { Plugin, UserConfig } from 'vite'

export default {
  plugins: [react(), vike(), vikeReactZustandPlugin()]
} satisfies UserConfig

function vikeReactZustandPlugin(): Plugin {
  const idsToStoreKeys: { [id: string]: Set<string> } = {}
  return {
    name: 'vikeReactZustand',
    enforce: 'post',
    transform(code, id) {
      if (id.includes('node_modules')) {
        return
      }
      const res = parse(code)
      let importLine = res[0].find((line) => line.n === 'vike-react-zustand')
      if (!importLine) {
        return
      }
      const lin = code.slice(importLine.ss, importLine.se)
      const imports = lin
        .substring(lin.indexOf('{') + 1, lin.indexOf('}'))
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

      // Playground: https://regex101.com/r/K8paF7/1
      const matches = code.matchAll(/create\s*(?:<[\s\w<>:.&|{}[\],="]*)?(?:\([\w'"`{}()\s]*?\))?\s*?\(/g)
      let idx = 0
      for (const match of matches) {
        if (!match.index || !match.input) {
          continue
        }
        const key = simpleHash(`${id}:${idx}`)
        idsToStoreKeys[id] ??= new Set([key])
        idsToStoreKeys[id].add(key)
        code =
          match.input.substring(0, match.index) +
          `${match[0]}'${key}',` +
          match.input.substring(match.index + match[0].length)
        idx++
      }

      return code
    },
    async buildStart() {
      await init
    },
    async handleHotUpdate(ctx) {
      const modules = ctx.modules.filter((m) => m.id && m.id in idsToStoreKeys)
      if (!modules.length) return

      for (const module of modules) {
        if (!module.id) {
          continue
        }
        const storeKeysInFile = idsToStoreKeys[module.id]
        for (const key of storeKeysInFile) {
          //@ts-ignore
          if (globalThis.__vite_plugin_ssr?.['VikeReactZustandContext.ts']) {
            //@ts-ignore
            delete globalThis.__vite_plugin_ssr['VikeReactZustandContext.ts'].initializers[key]
          }
        }
      }

      ctx.server.ws.send({ type: 'full-reload' })
    }
  }
}

function simpleHash(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return (hash >>> 0).toString(36)
}
