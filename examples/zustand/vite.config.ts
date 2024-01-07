import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import type { Plugin, UserConfig } from 'vite'

export default {
  plugins: [react(), vike(), vikeReactZustandPlugin()]
} satisfies UserConfig

const hotReloaderCode = `
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload()
  })
}
`

function vikeReactZustandPlugin(): Plugin {
  const ids = new Set()
  return {
    name: 'vikeReactZustand',
    enforce: 'pre',
    transform(code, id) {
      const start_time = process.hrtime()
      if (id.includes('node_modules')) {
        return
      }
      // Playground: https://regex101.com/r/qFAOq5/1
      const hasCreate =
        /import(?:[\s\w,]*\{[\s\w,]*)(?<!as[\w\s]*)create[\s,}]+(?!as)[\s\w}]*from\s*["']vike-react-zustand["']/.test(
          code
        )
      if (!hasCreate) {
        return
      }

      // Playground: https://regex101.com/r/K8paF7/1
      code = code.replace(/create\s*(?:<[\s\w<>:.&|{}[\],="]*)?(?:\([\w'"`{}()\s]*?\))?\s*?\(/g, (match, position) => {
        const key = simpleHash(`${id}:${position}`)
        return `${match}'${key}',`
      })

      ids.add(id)
      code = code + hotReloaderCode

      let end_time = process.hrtime(start_time)
      // Print the Execution time.
      console.log('End Time:', end_time)
      return code
    },
    handleHotUpdate(ctx) {
      if (ctx.modules.some((m) => ids.has(m.id))) {
        //@ts-ignore
        if (globalThis.__vite_plugin_ssr?.['VikeReactZustandContext.ts']) {
          //@ts-ignore
          globalThis.__vite_plugin_ssr['VikeReactZustandContext.ts'].initializers = {}
        }
      }
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
